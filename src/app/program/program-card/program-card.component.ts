import { Component, Input, OnInit } from '@angular/core';
import { ProgramOverviewDTO } from '../program-overview-dto';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgramService } from '../program-service/program.service';
import { response } from 'express';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-program-card',
  imports: [CardModule, ButtonModule, RatingModule, CommonModule, FormsModule,ToastModule],
  templateUrl: './program-card.component.html',
  styleUrl: './program-card.component.css',
  providers:[MessageService]
})
export class ProgramCardComponent implements OnInit {
  @Input() program!: ProgramOverviewDTO;
  @Input() programType: string = "not-started";
  apiUrl: string;

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private programService: ProgramService,
    private messageService: MessageService
  ) {
    this.apiUrl = programService.apiUrl;
  }

  ngOnInit(): void {
  }



  navigateToDetails(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.program.id) {
      this.router.navigate(['/programs', this.program.id]);
    }
  }


  startProgram(event: Event): void {
    event.stopPropagation(); // Prevent card click when clicking like button
    this.programService.startProgram(this.program.id!).subscribe(
      {
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'You have successfully started the program!'
          });
        }
      }
    );
  }

  startWorkout(event: Event): void {
    event.stopPropagation(); // Prevent card click when clicking like button
    this.router.navigate(['/workout-tracker', this.program.startedProgramId]);

  }

  seeHistory(event: Event): void {
    event.stopPropagation(); // Prevent card click when clicking like button
    this.router.navigate(['/programs-history', this.program.startedProgramId]);

  }
  
  handleImageError(event: any): void {
    const target = event.target;
    target.src = 'placeholder-program.png'; // Use your fallback image
  }



}
