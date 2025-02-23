import { Component, Input } from '@angular/core';
import { ProgramOverviewDTO } from '../program-overview-dto';
import { CardModule } from 'primeng/card';
import {ButtonModule} from 'primeng/button' 
@Component({
  selector: 'app-program-card',
  imports: [CardModule,ButtonModule],
  templateUrl: './program-card.component.html',
  styleUrl: './program-card.component.css'
})
export class ProgramCardComponent {
  @Input() program!: ProgramOverviewDTO;

  getImageUrl(): string {
      return `data:image/jpeg;base64,${this.program.imageData}`;
  }
}
