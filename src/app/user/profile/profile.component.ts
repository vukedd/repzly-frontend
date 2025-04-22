import { Component } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext'
import { PersonalInformationSectionComponent } from "./personal-information-section/personal-information-section.component";
import { ChangePasswordSectionComponent } from "./change-password-section/change-password-section.component";

@Component({
  selector: 'app-profile',
  imports: [FieldsetModule, ButtonModule, InputTextModule, PersonalInformationSectionComponent, ChangePasswordSectionComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

}
