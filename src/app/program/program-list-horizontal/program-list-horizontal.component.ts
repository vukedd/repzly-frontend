import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ProgramOverviewDTO } from '../program-overview-dto';
import { ProgramService } from '../program-service/program.service';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgramCardComponent } from "../program-card/program-card.component";
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { JwtService } from '../../auth/jwt/jwt.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ChartModule } from 'primeng/chart';
import { CarouselModule, Carousel } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { RippleModule } from 'primeng/ripple';
import { BreakpointObserver } from '@angular/cdk/layout';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-program-list-horizontal',
  standalone: true,
  imports: [
    ToolbarModule,
    ButtonModule,
    ProgressSpinnerModule,
    ProgramCardComponent,
    CommonModule,
    PaginatorModule,
    ChartModule,
    CarouselModule,
    TagModule,
    RippleModule
  ],
  templateUrl: './program-list-horizontal.component.html',
  styleUrl: './program-list-horizontal.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ProgramListHorizontalComponent implements OnInit {
  @ViewChild('programCarousel') carousel!: Carousel;

  programs: ProgramOverviewDTO[] = [];
  allLoadedPrograms: ProgramOverviewDTO[] = []; // Store all loaded programs
  carouselItems: any[] = []; // Items to display in carousel
  loading: boolean = true;
  public first: number = 0;
  public rows: number = 10;
  public page: number = 0;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  private currentCarouselPage: number = 0;
  private isLoadingMore: boolean = false;

  showNavigatorButtons: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private programService: ProgramService,
    private jwtService: JwtService,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() {
    if (this.isLoggedIn()) {

      // Initial load of started programs
      this.loadStartedPrograms(0, 10);
      this.breakpointObserver
            .observe(['(min-width: 768px)'])
            .pipe(takeUntil(this.destroy$))
            .subscribe(result => {
              this.showNavigatorButtons = result.matches;
            });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  public isLoggedIn(): boolean {
    return this.jwtService.isLoggedIn();
  }

  loadStartedPrograms(page: number, size: number) {
    this.loading = true;
    this.programService.getStartedProgramsOverview(size, page).subscribe({
      next: (response) => {
        // Add new programs to the allLoadedPrograms array without duplicates
        const newPrograms = response.content.filter(newProgram =>
          !this.allLoadedPrograms.some(existingProgram =>
            existingProgram.id === newProgram.id
          )
        );

        this.allLoadedPrograms = [...this.allLoadedPrograms, ...newPrograms];
        this.programs = this.allLoadedPrograms;
        this.totalRecords = response.page.totalElements;
        this.totalPages = response.page.totalPages;
        this.loading = false;

        // Create carousel items
        this.updateCarouselItems();
        this.isLoadingMore = false;
      },
      error: (error) => {
        console.error('Error loading started programs:', error);
        this.loading = false;
        this.isLoadingMore = false;
      }
    });
  }

  // Update carousel items array with program cards
  updateCarouselItems() {
    // Save current items length to compare
    const previousLength = this.carouselItems.length;

    this.carouselItems = this.programs.map(program => ({ type: 'program-card', program }));

    // If we're loading more items (not initial load), preserve carousel position
    if (this.isLoadingMore && previousLength > 0) {
      // We need to set the carousel position after the view updates
      setTimeout(() => {
        // If we have access to the carousel directly via ViewChild
        if (this.carousel) {
          this.carousel.page = this.currentCarouselPage;
        }
      });
    }
  }

  onPageChange(event: PageEvent) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = event.page;

    // Check if we need to load more programs
    const totalLoadedItems = this.allLoadedPrograms.length;
    const requestedItems = (this.page + 1) * this.rows;

    if (totalLoadedItems < requestedItems && totalLoadedItems < this.totalRecords) {
      this.loadStartedPrograms(this.page, this.rows);
    }
  }

  // Called when carousel page changes to potentially load more data
  onCarouselPageChange(event: any) {
    // Store the current page position
    this.currentCarouselPage = event.page;

    // When approaching the end of loaded items, load more data
    if (event.page >= this.carouselItems.length - 3 &&
      this.allLoadedPrograms.length < this.totalRecords &&
      !this.isLoadingMore) {

      this.isLoadingMore = true;
      this.page++;
      this.loadStartedPrograms(this.page, this.rows);
    }
  }


}