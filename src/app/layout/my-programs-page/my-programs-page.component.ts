import { Component, OnInit } from '@angular/core';
import { JwtService } from '../../auth/jwt/jwt.service';
import { ProgramListComponent } from "../../program/program-list/program-list.component";
import { InputGroup } from 'primeng/inputgroup';
import { ButtonModule } from 'primeng/button';
import { InputGroupAddon } from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-my-programs-page',
  imports: [ProgramListComponent, InputGroup, ButtonModule, InputGroupAddon],
  templateUrl: './my-programs-page.component.html',
  styleUrl: './my-programs-page.component.css'
})
export class MyProgramsPageComponent implements OnInit{
  username: string = "";
  constructor(private jwtService: JwtService) {}

  ngOnInit(): void {
    if (this.jwtService.isLoggedIn()) {
      this.jwtService.getLoggedInUser().subscribe({
        next: (response) => {
          this.username = response.username;
        },
        error: (error) => {
          console.error("An error occurred while fetching logged in user", error);
        }
      });
    }
  }
}
