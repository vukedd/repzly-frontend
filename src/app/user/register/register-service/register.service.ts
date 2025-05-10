import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterRequestDto } from '../dtos/register-request-dto';
import { Observable } from 'rxjs';
import { API_URL } from '../../../../globals';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiURL: string = API_URL+"/auth/register";
  
  constructor(private http: HttpClient) { }

  registerUser(registerData: RegisterRequestDto): Observable<any> {
    return this.http.post(this.apiURL, registerData);
  }
}