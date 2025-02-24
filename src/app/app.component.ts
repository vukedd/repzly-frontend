import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProgramListComponent } from "./program/program-list/program-list.component";
import { ButtonModule } from 'primeng/button';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProgramListComponent,ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isDarkMode = false;
  title = 'fitness-program-app';
  constructor(private themeService: ThemeService) {
    this.themeService.darkMode$.subscribe(
        isDark => this.isDarkMode = isDark
    );
} 
  toggleTheme() {
    this.themeService.toggleDarkMode();
}
}
