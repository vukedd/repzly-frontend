import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from "./layout/header/header.component";
import { AvatarModule } from 'primeng/avatar';
import { InputGroupModule } from 'primeng/inputgroup';
import { JwtService } from './auth/jwt/jwt.service';
import { LandingPageComponent } from "./layout/landing-page/landing-page.component";
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, RouterModule, HeaderComponent, AvatarModule, InputGroupModule, LandingPageComponent, CommonModule, ProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit{
  title = 'fitness-program-app';
  isLoading = true;
  
  constructor(private jwtService: JwtService) {}

  ngOnInit() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 5000);
  }

  isLoggedIn(): boolean {
    return this.jwtService.isLoggedIn();
  }
}