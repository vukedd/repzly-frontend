import { Component, OnInit } from '@angular/core';
import { JwtService } from '../../auth/jwt/jwt.service';
import { ProgramListComponent } from "../../program/program-list/program-list.component";
import { InputGroupModule } from 'primeng/inputgroup';
import { ButtonModule } from 'primeng/button';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SearchService } from '../../search/search.service';
import { timeStamp } from 'console';

@Component({
  selector: 'app-my-programs-page',
  imports: [ProgramListComponent
      , InputTextModule
      , InputGroupModule
      , InputGroupAddonModule
      , ButtonModule],
  templateUrl: './my-programs-page.component.html',
  styleUrl: './my-programs-page.component.css'
})
export class MyProgramsPageComponent implements OnInit{
  username: string = "";
  isSearchPossible: boolean = false;
  constructor(private jwtService: JwtService, private searchService: SearchService) {}

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

    this.searchService.currentProgramsType.subscribe(
      (programsType) => {
        if (programsType != 'started') {
          this.isSearchPossible = true;
        } else {
          this.isSearchPossible = false;
          this.searchService.updateSearchTerm('');
        }
      }
    );
  }

  searchMyPrograms(searchInput: string) {
    if (this.isSearchPossible) {
      console.log('This is the input', searchInput);
      this.searchService.updateSearchTerm(searchInput);
    }
  }
  
}
