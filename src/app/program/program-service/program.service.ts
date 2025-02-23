import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ProgramOverviewDTO} from "../program-overview-dto"

@Injectable({
    providedIn: 'root'
})
export class ProgramService {
    private apiUrl = 'http://localhost:8080/api/programs';

    constructor(private http: HttpClient) {}

    getPrograms(): Observable<ProgramOverviewDTO[]> {
        return this.http.get<ProgramOverviewDTO[]>(this.apiUrl);
    }
}