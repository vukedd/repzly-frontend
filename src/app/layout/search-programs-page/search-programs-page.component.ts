import { Component } from '@angular/core';
import { ProgramListComponent } from "../../program/program-list/program-list.component";
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { OnInit } from '@angular/core';
import { SearchService } from '../../search/search.service';

@Component({
  selector: 'app-search-programs-page',
  imports: [ProgramListComponent
    , InputTextModule
    , InputGroupModule
    , InputGroupAddonModule
    , ButtonModule],
  templateUrl: './search-programs-page.component.html',
  styleUrl: './search-programs-page.component.css'
})
export class SearchProgramsPageComponent implements OnInit{

  searchText:string='';
  isSearchPossible = false;

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
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

  searchPrograms(searchInput: string) {
    if (this.isSearchPossible) {
      this.searchService.updateSearchTerm(searchInput);
    }
  }
}
