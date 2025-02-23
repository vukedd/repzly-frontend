import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProgramListComponent } from "./program/program-list/program-list.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProgramListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fitness-program-app';
}
