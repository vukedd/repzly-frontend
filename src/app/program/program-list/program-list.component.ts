import { Component, Input, OnInit } from '@angular/core';
import { ProgramOverviewDTO } from '../program-overview-dto';
import { ProgramService } from '../program-service/program.service';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgramCardComponent } from "../program-card/program-card.component";
import { AddProgramCardComponent } from "../add-program-card/add-program-card.component";
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { JwtService } from '../../auth/jwt/jwt.service';
import { Subscription } from 'rxjs';
import { SearchService } from '../../search/search.service';
import { ChartModule } from 'primeng/chart';


interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-program-list',
  standalone: true,
  imports: [
    ToolbarModule,
    ButtonModule,
    ProgressSpinnerModule,
    ProgramCardComponent,
    AddProgramCardComponent,
    CommonModule,
    PaginatorModule,
    ChartModule
  ],
  templateUrl: './program-list.component.html',
  styleUrl: './program-list.component.css'
})
export class ProgramListComponent implements OnInit {
  @Input() programsType: string = '';
  programs: ProgramOverviewDTO[] = [];
  loading: boolean = true;
  public first: number = 0;
  public rows: number = 10;
  public page: number = 0;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  private searchInput: string = "";
  private searchAllSubscription: Subscription | undefined;

  constructor(private programService: ProgramService, private jwtService: JwtService, private searchService: SearchService) { }

  ngOnInit() {
    if (this.isLoggedIn()) {
      this.searchService.updateProgramsType(this.programsType);
      this.searchService.updateSearchTerm('');
      this.searchAllSubscription = this.searchService.currentSearchTerm.subscribe(
        (searchTerm) => {
          if (this.programsType == "started") {
            this.loadPrograms(0, 10);
          } else if (this.programsType == "search"){
            this.searchPrograms(this.rows, 0, searchTerm);
          } else {
            this.getProgramsCreatedByMe(this.rows, 0, searchTerm);
          }
        }
      );
    }
  }

  public isLoggedIn(): boolean {
    return this.jwtService.isLoggedIn()
  }

  loadPrograms(page: number, size: number) {
    this.loading = true;
    switch (this.programsType) {
      case "started":{
        this.programService.getStartedProgramsOverview(size, page).subscribe({
          next: (response) => {
            this.programs = response.content;
            this.totalRecords = response.page.totalElements;
            this.totalPages = response.page.totalPages;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading programs:', error);
            this.loading = false;
          }
        });
        break;
      }
      case "search":{
        this.programService.searchProgramOverviews(size, page, this.searchInput).subscribe({
          next: (response) => {
            this.programs = response.content;
            this.totalRecords = response.page.totalElements;
            this.totalPages = response.page.totalPages;
            this.loading = false;
            this.programsType = 'search';
            this.searchInput = this.searchInput;
          },
          error: (error) => {
            console.error("An error occurred while searching programs", error);
            this.loading = false;
          }
        });
        break;
      }
      case "my-programs": {
        this.programService.getProgramsCreatedByMe(size, page, this.searchInput).subscribe({
          next: (response) => {
            this.programs = response.content;
            this.totalRecords = response.page.totalElements;
            this.totalPages = response.page.totalPages;
            this.loading = false;
            this.programsType = "my-programs"
            this.searchService.updateSearchTerm("");
          },
          error: (error) => {
            console.error('Error loading programs:', error);
            this.loading = false;
          }
        })
        break;
      }
      default:{
        this.programService.getAllProgramsOverview(size, page).subscribe({
          next: (response) => {
            this.programs = response.content;
            this.totalRecords = response.page.totalElements;
            this.totalPages = response.page.totalPages;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading programs:', error);
            this.loading = false;
          }
        });
        break;
      }
    }
  }

  searchPrograms(size: number, page: number, searchFilter: string) {
    this.loading = true;
    this.programService.searchProgramOverviews(size, page, searchFilter).subscribe({
      next: (response) => {
        this.programs = response.content;
        this.totalRecords = response.page.totalElements;
        this.totalPages = response.page.totalPages;
        this.loading = false;
        this.programsType = 'search';
        this.searchInput = searchFilter;
      },
      error: (error) => {
        console.error("An error occurred while searching programs", error);
        this.loading = false;
      }
    });
  }

  getProgramsCreatedByMe(size: number, page: number, title: string) {
    this.programService.getProgramsCreatedByMe(size, page,  title).subscribe({
      next: (response) => {
        this.programs = response.content;
        this.totalRecords = response.page.totalElements;
        this.totalPages = response.page.totalPages;
        this.loading = false;
        this.programsType = "my-programs"
        console.log(response);
      },
      error: (error) => {
        console.error('Error loading programs:', error);
        this.loading = false;
      }
    })
  }

  onPageChange(event: PageEvent) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = event.page;

    this.loadPrograms(this.page, this.rows);
  }

  ngOnDestroy() {
    if (this.searchAllSubscription) {
      this.searchAllSubscription.unsubscribe();
    }
  }
}