import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponse } from '../../common/page/page-response';
import { Program } from '../program.model';
import { API_URL } from '../../../globals';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  public apiUrl = `${API_URL}/programs`;

  constructor(private http: HttpClient) { }

  getAllProgramsOverview(size: number, page: number): Observable<PageResponse> {
    let params = new HttpParams()
      .set('size', size.toString())
      .set('page', page.toString());

    return this.http.get<PageResponse>(this.apiUrl, { params });
  }

  getStartedProgramsOverview(size: number, page: number): Observable<PageResponse> {
    let params = new HttpParams()
      .set('size', size.toString())
      .set('page', page.toString());

    return this.http.get<PageResponse>(`${this.apiUrl}/started`, { params });
  }

  searchProgramOverviews(size: number, page: number, searchFilter: string): Observable<PageResponse> {
    let params = new HttpParams()
    .set("size", size.toString())
    .set("page", page.toString())
    .set("title", searchFilter);

    return this.http.get<PageResponse>(`${this.apiUrl}/search`, { params });
  }

  getProgramById(id: number): Observable<Program> {
    return this.http.get<Program>(`${this.apiUrl}/${id}`);
  }

  createProgram(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  // Helper method to prepare the form data with proper mapping
  prepareFormData(program: Program, image: File | null): FormData {
    // Create a deep copy to modify without affecting the original
    const programCopy = this.mapProgramForBackend(program);

    const formData = new FormData();
    formData.append('program', JSON.stringify(programCopy));
    console.log(formData);

    if (image) {
      formData.append('image', image);
    }

    return formData;
  }

  // Map the frontend program model to match backend expectations
  private mapProgramForBackend(program: Program): any {
    console.log(program);
    return {
      name: program.name,
      weeks: program.weeks.map(week => ({
        workouts: week.workouts.map(workout => ({
          title: workout.title,
          description: workout.description,
          number: workout.number,
          workoutExercises: workout.workoutExercises.map(exercise => ({
            exercise: exercise.exercise.id,
            minimumRestTime: exercise.minimumRestTime,
            maximumRestTime: exercise.maximumRestTime,
            sets: exercise.sets.map(set => {
              // Debug logs to help identify problems
              console.log('Set volume metric:', set.volumeMetric);
              console.log('Set intensity metric:', set.intensityMetric);

              return {
                volumeMin: set.volume.minimumVolume,
                volumeMax: set.volume.maximumVolume,
                intensityMin: set.intensity.minimumIntensity,
                intensityMax: set.intensity.maximumIntensity,
                volumeMetric: set.volumeMetric?.id || null,
                intensityMetric: set.intensityMetric?.id || null
              };
            })
          }))
        }))
      }))
    };
  }

  getCurrentWorkout(workoutId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/current-workout/${workoutId}`);
  }

  createExerciseHistory(historyData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/history/exercise`, historyData);
  }

  startProgram(programId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/start-program/${programId}`, {});
  }

  getProgramHistory(startedProgramId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/history/${startedProgramId}`);
  }

  getProgramWeeklyVolume(startDate: string, endDate: string) {
    return this.http.get<any>(`${this.apiUrl}/weekly-volume?startDate=` + startDate + `&endDate=` + endDate);
  }
}