import { Component } from '@angular/core';
import { RouterOutlet,RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, RouterModule],
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
