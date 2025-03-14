import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Exercise, ExerciseOverview } from '../program/program.model';
import { API_URL } from '../../globals';
import { ExerciseHistoryDTO } from './exercise-history-dialog/exercise-history-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private apiUrl = `${API_URL}/exercises`;

  constructor(private http: HttpClient) { }

  getExercisesOverview(): Observable<ExerciseOverview[]> {
    return this.http.get<ExerciseOverview[]>(this.apiUrl);
  }

  getExercise(id: number): Observable<Exercise> {
    return this.http.get<Exercise>(`${this.apiUrl}/${id}`);
  }

  createExercise(exercise: Exercise): Observable<Exercise> {
    return this.http.post<Exercise>(this.apiUrl, exercise);
  }
  getExerciseHistory(exerciseId: number): Observable<ExerciseHistoryDTO> {
    return this.http.get<ExerciseHistoryDTO>(`${this.apiUrl}/history/${exerciseId}`);
  }
}
