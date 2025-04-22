import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../globals';
import { Observable} from 'rxjs';
import { UserProfile } from './login/dtos/user-profile';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl: string = API_URL + "/user";
  constructor(private http: HttpClient) { }

  getUserProfile(refreshTokenId: string | null): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/me1?refreshTokenId=` + refreshTokenId);
  }
  
}
