import { Component, OnInit } from '@angular/core';
import { ProgramOverviewDTO } from '../program-overview-dto';
import { ProgramService } from '../program-service/program.service';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgramCardComponent } from "../program-card/program-card.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-program-list',
  imports: [ToolbarModule, ButtonModule, ProgressSpinnerModule, ProgramCardComponent,CommonModule],
  templateUrl: './program-list.component.html',
  styleUrl: './program-list.component.css'
})
export class ProgramListComponent implements OnInit {
  programs: ProgramOverviewDTO[] = [];
  loading: boolean = true;

  constructor(private programService: ProgramService) {}

  ngOnInit() {
      this.loadPrograms();
  }

  loadPrograms() {
      this.loading = true;
      this.programService.getPrograms().subscribe({
          next: (data) => {
              this.programs = data;
              this.loading = false;
          },
          error: (error) => {
              console.error('Error loading programs:', error);
              this.loading = false;
          }
      });
  }
}
