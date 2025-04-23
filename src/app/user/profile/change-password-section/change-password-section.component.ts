import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-change-password-section',
  imports: [FieldsetModule, ButtonModule, PasswordModule],
  templateUrl: './change-password-section.component.html',
  styleUrl: './change-password-section.component.css'
})
export class ChangePasswordSectionComponent {
}
