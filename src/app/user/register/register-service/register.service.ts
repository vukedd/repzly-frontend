import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterRequestDto } from '../dtos/register-request-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiURL: string = "http://localhost:8080/api/auth/register";
  
  constructor(private http: HttpClient) { }

  registerUser(registerData: RegisterRequestDto): Observable<any> {
    return this.http.post(this.apiURL, registerData);
  }
}