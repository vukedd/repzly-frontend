import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Exercise } from '../program.model';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private apiUrl = 'api/exercises';

  constructor(private http: HttpClient) { }

  getExercises(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(this.apiUrl);
  }

  getExercise(id: number): Observable<Exercise> {
    return this.http.get<Exercise>(`${this.apiUrl}/${id}`);
  }

  createExercise(exercise: Exercise): Observable<Exercise> {
    return this.http.post<Exercise>(this.apiUrl, exercise);
  }
}
