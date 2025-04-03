import { Component } from '@angular/core';
import { BodyHighlighterComponent } from "../../body-highlighter/component/body-highlighter.component";
import { BodyPartHighlight } from '../../body-highlighter/body-highlighter.model';
import { ProgramListComponent } from "../../program/program-list/program-list.component";
import { MuscleTrackerComponent } from "../../body-highlighter/muscle-tracker/muscle-tracker.component";

@Component({
  selector: 'app-home',
  imports: [ProgramListComponent, MuscleTrackerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
