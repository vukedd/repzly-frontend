import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgramOverviewDTO } from "../program-overview-dto"
import { PageResponse } from '../../common/page/page-response';
import { Program } from '../program.model';

@Injectable({
    providedIn: 'root'
})
export class ProgramService {
    private apiUrl = 'http://localhost:8080/api/programs';

    constructor(private http: HttpClient) {}

    getPrograms(size: number, page: number): Observable<PageResponse> {
        let params = new HttpParams()
          .set('size', size.toString())
          .set('page', page.toString());
          
        return this.http.get<PageResponse>(this.apiUrl, { params });
      }
      
      getProgram(id: number): Observable<Program> {
        return this.http.get<Program>(`${this.apiUrl}/${id}`);
      }
    
      createProgram(programData: FormData): Observable<Program> {
        return this.http.post<Program>(this.apiUrl, programData);
      }
    
      updateProgram(id: number, programData: FormData): Observable<Program> {
        return this.http.put<Program>(`${this.apiUrl}/${id}`, programData);
      }
    
      deleteProgram(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
      }
}