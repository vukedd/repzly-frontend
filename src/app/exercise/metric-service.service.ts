import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IntensityMetric, VolumeMetric } from '../program/program.model';
import { API_URL } from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class MetricService {
  private apiUrl = `${API_URL}/metrics`;

  constructor(private http: HttpClient) { }

  getVolumeMetrics(): Observable<VolumeMetric[]> {
    return this.http.get<VolumeMetric[]>(`${this.apiUrl}/volume-metrics`);
  }

  getIntensityMetrics(): Observable<IntensityMetric[]> {
    return this.http.get<IntensityMetric[]>(`${this.apiUrl}/intensity-metrics`);
  }
}
