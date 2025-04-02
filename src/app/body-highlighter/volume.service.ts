import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class VolumeService {
  private apiUrl = API_URL+ '/volume'; // Make sure apiUrl is defined in your environment files

  constructor(private http: HttpClient) { }

  /**
   * Gets muscle usage data from the backend.
   * @param startDate Optional start date.
   * @param endDate Optional end date.
   * @returns Observable<Record<string, number>> A map where keys are muscle names and values are usage metrics.
   */
  getMuscleUsage(startDate?: Date | null, endDate?: Date | null): Observable<Record<string, number>> {
    let params = new HttpParams();

    // Format dates as YYYY-MM-DD for the backend @DateTimeFormat
    if (startDate) {
        // Basic ISO string slicing. Use DatePipe for more complex formatting if needed.
        params = params.set('startDate', startDate.toISOString().split('T')[0]);
    }
    if (endDate) {
        params = params.set('endDate', endDate.toISOString().split('T')[0]);
    }

    // The HttpClient handles authentication headers automatically if you have an interceptor set up.
    return this.http.get<Record<string, number>>(`${this.apiUrl}/per-muscle`, { params });
  }
}