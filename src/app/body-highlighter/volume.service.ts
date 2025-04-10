import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class VolumeService {
  private apiUrl = API_URL + '/volume'; // Make sure apiUrl is defined in your environment files

  constructor(private http: HttpClient) { }

  /**
   * Gets muscle usage data from the backend.
   * @param startDate Optional start date.
   * @param endDate Optional end date.
   * @returns Observable<Record<string, number>> A map where keys are muscle names and values are usage metrics.
   */
  getMuscleUsage(startDate?: Date | null, endDate?: Date | null): Observable<Record<string, number>> {
    let params = new HttpParams();
    
    if (startDate) {
        params = params.set('startDate', startDate.toISOString().split('T')[0]);
    }
    
    if (endDate) {
        // Add one day to endDate to ensure the full selected day is included
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 2);
        params = params.set('endDate', adjustedEndDate.toISOString().split('T')[0]);
    } else {
        // If no end date provided, use tomorrow's date
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 2);
        params = params.set('endDate', tomorrow.toISOString().split('T')[0]);
    }
    
    return this.http.get<Record<string, number>>(`${this.apiUrl}/per-muscle`, { params });
  }

  getProgramWeeklyVolume(startDate: string, endDate: string) {
    return this.http.get<any>(`${this.apiUrl}/weekly-volume?startDate=` + startDate + `&endDate=` + endDate);
  }

  getWeeklyWorkoutDurationReport(startDate: string, endDate:string) {
    console.log(startDate);
    console.log(endDate);
    return this.http.get<any>(`${this.apiUrl}/weekly-workout-duration-report?startDate=` + startDate + `&endDate=` + endDate);
  }
}