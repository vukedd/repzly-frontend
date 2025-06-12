import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponse } from '../../common/page/page-response';
import { Program } from '../program.model';
import { API_URL } from '../../../globals';
import { title } from 'process';

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

    if (image) {
      formData.append('image', image);
    }

    return formData;
  }

  prepareFormDataUpdate(program: Program, image: File | null): FormData {
    // Create a deep copy to modify without affecting the original
    const programCopy = this.mapProgramForBackendUpdate(program);

    const formData = new FormData();
    formData.append('program', JSON.stringify(programCopy));

    if (image) {
      formData.append('image', image);
    }

    return formData;
  }

  // Map the frontend program model to match backend expectations
  private mapProgramForBackend(program: any): any {
    return {
      name: program.name,
      public:program.public,
      description:program.description,
      weeks: program.weeks.map((week:any) => ({
        workouts: week.workouts.map((workout:any) => ({
          title: workout.title,
          description: workout.description,
          workoutExercises: workout.workoutExercises.map((exercise:any) => ({
            exercise: exercise.exercise.id,
            minimumRestTime: exercise.restTimeMetric === 's' ? exercise.minimumRestTime : exercise.minimumRestTime * 60,
            maximumRestTime: exercise.restTimeMetric === 's' ? exercise.maximumRestTime : exercise.maximumRestTime * 60,
            sets: exercise.sets.map((set:any) => {
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

  private mapProgramForBackendUpdate(program: any): any {
    return {
      name: program.name,
      id: program.id,
      public:program.public,
      description:program.description,
      weeks: program.weeks.map((week:any) => ({
        id:week.id,
        workouts: week.workouts.map((workout:any) => ({
          id:workout.id,
          title: workout.title,
          description: workout.description,
          workoutExercises: workout.workoutExercises.map((exercise:any) => ({
            id:exercise.id,
            exercise: exercise.exercise.id,
            minimumRestTime: exercise.restTimeMetric === 's' ? exercise.minimumRestTime : exercise.minimumRestTime * 60,
            maximumRestTime: exercise.restTimeMetric === 's' ? exercise.maximumRestTime : exercise.maximumRestTime * 60,
            sets: exercise.sets.map((set:any) => {
              return {
                id:set.id,
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


  getProgramImage(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/image/${id}`, { responseType: 'blob' });
  }

  updateProgram(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
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

  deleteProgram(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getProgramsCreatedByMe(size: number, page: number, title: string): Observable<any> {
    let params = new HttpParams()
    .set('size', size.toString())
    .set('page', page.toString())
    .set('title', title);


    return this.http.get<any>(`${this.apiUrl}/my-programs`, {params});
  }
}