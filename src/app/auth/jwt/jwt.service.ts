import { Injectable } from '@angular/core';
import { API_URL } from '../../../globals';
import { HttpClient } from '@angular/common/http';
import { LoginRequestDto } from '../../user/login/dtos/login-request-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  constructor(private http: HttpClient) { }

  isLoggedIn(): boolean {
    return false;
  }

  private apiURL: string = API_URL + "/auth/login"

  sendLoginRequest(request: LoginRequestDto): Observable<any> {
    return this.http.post(this.apiURL, request);
  }
}
