import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
  selector: 'app-personal-information-section',
  imports: [FieldsetModule, ButtonModule],
  templateUrl: './personal-information-section.component.html',
  styleUrl: './personal-information-section.component.css'
})
export class PersonalInformationSectionComponent {

}
