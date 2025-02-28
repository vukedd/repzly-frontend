import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-add-program-card',
  imports: [ButtonModule,CardModule,CommonModule],
  templateUrl: './add-program-card.component.html',
  styleUrl: './add-program-card.component.css'
})
export class AddProgramCardComponent {
  onHover: boolean = false;
  
  constructor(private router: Router) {}
  
  navigateToCreate(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate(['/create-program']);
  }
}
