import { Component, HostListener, OnInit } from '@angular/core';
import { MuscleTrackerComponent } from "../../body-highlighter/muscle-tracker/muscle-tracker.component";
import { VolumeGraphComponent } from "../../volume-graph/volume-graph.component";
import { JwtService } from '../../auth/jwt/jwt.service';
import { ProgramListHorizontalComponent } from "../../program/program-list-horizontal/program-list-horizontal.component";
import { ButtonModule } from 'primeng/button';
import { WorkoutDurationGraphComponent } from "../../workout-duration-graph/workout-duration-graph.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [MuscleTrackerComponent,
    VolumeGraphComponent,
    ProgramListHorizontalComponent,
    ButtonModule,
    WorkoutDurationGraphComponent,
    CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{
  constructor(public jwtService: JwtService) { }
  
  isLoggedIn(): boolean {
    return this.jwtService.isLoggedIn()
  }
}
