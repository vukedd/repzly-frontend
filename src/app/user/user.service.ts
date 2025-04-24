import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../globals';
import { Observable} from 'rxjs';
import { UserProfile } from './login/dtos/user-profile';
import { PasswordChangeResponseDto } from './profile/change-password-section/password-change-response-dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl: string = API_URL + "/user";
  constructor(private http: HttpClient) { }

  getUserProfile(refreshTokenId: string | null): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/me1?refreshTokenId=` + refreshTokenId);
  }
  
  changeUserPassword(refreshTokenId: string | null, oldPassword: string | null | undefined, newPassword: string| null | undefined) {
    let requestBody = new FormData();
    requestBody.append("refreshTokenId", refreshTokenId ?? '-1');
    requestBody.append("oldPassword", oldPassword ?? '');
    requestBody.append("newPassword", newPassword ?? '');

    return this.http.put<PasswordChangeResponseDto>(`${this.baseUrl}/edit-password`, requestBody);
  } 
}
