import { Injectable } from '@angular/core';
import { API_URL } from '../../globals';
import { HttpClient } from '@angular/common/http';
import { NextWorkout } from './next-workout';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  public apiUrl = `${API_URL}/workouts`;

  constructor(private http: HttpClient) { }

  getNextWorkout(programId:number): Observable<NextWorkout> {
    return this.http.get<NextWorkout>(`${this.apiUrl}/next/${programId}`);
  }
}
