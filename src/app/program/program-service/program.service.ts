import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgramOverviewDTO } from "../program-overview-dto"
import { PageResponse } from '../../common/page/page-response';

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
}