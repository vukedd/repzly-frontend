import { Component } from '@angular/core';
import { BodyHighlighterComponent } from "../../body-highlighter/component/body-highlighter.component";
import { BodyPartHighlight } from '../../body-highlighter/body-highlighter.model';
import { MuscleTrackerComponent } from "../../body-highlighter/muscle-tracker/muscle-tracker.component";
import { VolumeGraphComponent } from "../../volume-graph/volume-graph.component";
import { JwtService } from '../../auth/jwt/jwt.service';
import { ProgramListHorizontalComponent } from "../../program/program-list-horizontal/program-list-horizontal.component";
import { ProgramListComponent } from "../../program/program-list/program-list.component";
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  imports: [MuscleTrackerComponent, VolumeGraphComponent, ProgramListHorizontalComponent, ProgramListComponent,ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private jwtService: JwtService) { }
  

  isLoggedIn(): boolean {
    return this.jwtService.isLoggedIn()
  }
}
