import { Injectable } from '@angular/core';
import { API_URL } from '../../globals';
import { HttpClient } from '@angular/common/http';
import { DoneSet, NextWorkout } from './next-workout';
import { Observable } from 'rxjs';
import { CreateDoneSetDTO } from './create-done-set-dto';
import {CompleteSetResponseDTO} from "./complete-set-response-dto";
import {CompleteWorkoutResponseDTO} from "./complete-workout-response-dto";


@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  public apiUrl = `${API_URL}/workouts`;

  constructor(private http: HttpClient) { }

  getNextWorkout(programId: number): Observable<NextWorkout> {
    return this.http.get<NextWorkout>(`${this.apiUrl}/next/${programId}`);
  }

  completeSet(doneSetDTO: CreateDoneSetDTO): Observable<DoneSet> {
    return this.http.post<DoneSet>(`${this.apiUrl}/completeSet`, doneSetDTO);
  }

  completeWorkout(workoutId: number, startedProgramId: number): Observable<CompleteWorkoutResponseDTO> {
    return this.http.post<CompleteWorkoutResponseDTO>(`${this.apiUrl}/completeWorkout/${workoutId}/${startedProgramId}`, {});
  }

  uncompleteSet(startedWorkoutId: number, doneSetId: number): Observable<CompleteSetResponseDTO> {
    return this.http.delete<CompleteSetResponseDTO>(
      `${this.apiUrl}/uncompleteSet/${startedWorkoutId}/${doneSetId}`
    );
  }

}
