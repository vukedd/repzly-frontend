import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../../globals';
import { LoginRequestDto } from '../dtos/login-request-dto';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiURL: string = API_URL + "/auth/login"

  constructor(private http: HttpClient) { }

  sendLoginRequest(request: LoginRequestDto): Observable<any> {
    return this.http.post(this.apiURL, request);
  }
}
