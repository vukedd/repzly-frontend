import { Component } from '@angular/core';
import { BodyHighlighterComponent } from "../../body-highlighter/component/body-highlighter.component";
import { BodyPartHighlight } from '../../body-highlighter/body-highlighter.model';
import { ProgramListComponent } from "../../program/program-list/program-list.component";
import { MuscleTrackerComponent } from "../../body-highlighter/muscle-tracker/muscle-tracker.component";
import { JwtService } from '../../auth/jwt/jwt.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [ProgramListComponent, MuscleTrackerComponent,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private jwtService: JwtService) { }
  

  isLoggedIn(): boolean {
    return this.jwtService.isLoggedIn()
  }
}
