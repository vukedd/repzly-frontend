import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet, RouterModule, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from "./layout/header/header.component";
import { AvatarModule } from 'primeng/avatar';
import { InputGroupModule } from 'primeng/inputgroup';
import { JwtService } from './auth/jwt/jwt.service';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LandingPageComponent } from "./layout/landing-page/landing-page.component";
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToastsPositionService } from './layout/toasts/toasts-position.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, RouterModule, HeaderComponent, AvatarModule, 
    InputGroupModule, CommonModule, ProgressSpinnerModule, LandingPageComponent, 
    DividerModule, ToastModule
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit{
  title = 'fitness-program-app';
 
  constructor(
    public jwtService: JwtService,    
    private route: ActivatedRoute,
    private messageService: MessageService,
    public toastsPositionService: ToastsPositionService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const message = params['status'];
      if (message) {
        switch (message) {
          case '200':
            this.messageService.add({severity: 'success', summary: 'Verification success', detail: 'Your account is successfully verified!'});
            break;
          case '409':
            this.messageService.add({severity: 'error', summary: 'Verification failed', detail: 'Your account is already verified!'});
            break;
          case '400':
            this.messageService.add({severity: 'error', summary: 'Verification failed', detail: 'Token expired!'});
            break;
        }
      }
    });
  }
}

