import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { UserService } from '../../user.service';
import { JwtService } from '../../../auth/jwt/jwt.service';
import { UserProfile } from '../../login/dtos/user-profile';

@Component({
  selector: 'app-personal-information-section',
  imports: [FieldsetModule, ButtonModule],
  templateUrl: './personal-information-section.component.html',
  styleUrl: './personal-information-section.component.css'
})
export class PersonalInformationSectionComponent implements OnInit{
  userInformation: UserProfile | null = null;

  constructor(private userService: UserService, private jwtService: JwtService) {}

  ngOnInit(): void {
    this.userService.getUserProfile(this.jwtService.getRefreshToken()).subscribe(
      {
        next: (response) => {
          this.userInformation = response;
        }, 
        error: (error) => {

        }
      }
    )
  }

}
