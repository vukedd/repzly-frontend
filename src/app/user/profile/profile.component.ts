import { Component, OnInit } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext'
import { PersonalInformationSectionComponent } from "./personal-information-section/personal-information-section.component";
import { ChangePasswordSectionComponent } from "./change-password-section/change-password-section.component";
import { UserService } from '../user.service';
import { JwtService } from '../../auth/jwt/jwt.service';

@Component({
  selector: 'app-profile',
  imports: [FieldsetModule, ButtonModule, InputTextModule, PersonalInformationSectionComponent, ChangePasswordSectionComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  username: string | null = null;

  constructor(private userService: UserService, private jwtService: JwtService) {}

  ngOnInit(): void {
    this.userService.getUserProfile(this.jwtService.getRefreshToken()).subscribe(
      {
        next: (response) => {
          this.username = response.username;
        }, 
        error: (error) => {

        }
      }
    )
  }
}
