import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet,RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from "./layout/header/header.component";
import { AvatarModule } from 'primeng/avatar';
import { InputGroupModule } from 'primeng/inputgroup';
import { JwtService } from './auth/jwt/jwt.service';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from "./layout/landing-page/landing-page.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, RouterModule, HeaderComponent, AvatarModule, InputGroupModule, CommonModule, LandingPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation:ViewEncapsulation.None
})
export class AppComponent {
  constructor(private jwtService: JwtService) {}

  title = 'fitness-program-app';
  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {}
  }

  isLoggedIn() {
    return this.jwtService.isLoggedIn();
  }
}