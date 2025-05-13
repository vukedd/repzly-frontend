import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
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
import { CardModule } from 'primeng/card'; // Import CardModule

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
    RippleModule,
    CardModule // Add CardModule here
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
    private breakpointObserver: BreakpointObserver,
    private router: Router // Inject Router
  ) { }

  ngOnInit() {
    Carousel.prototype.onTouchMove = () => { };

    if (this.isLoggedIn()) {
      // Initial load of started programs
      this.loadStartedPrograms(0, 10); // Assuming default rows is 10
      this.breakpointObserver
            .observe(['(min-width: 768px)'])
            .pipe(takeUntil(this.destroy$))
            .subscribe(result => {
              this.showNavigatorButtons = result.matches;
            });
    } else {
      this.loading = false; // If not logged in, set loading to false
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
        const newPrograms = response.content.filter(newProgram =>
          !this.allLoadedPrograms.some(existingProgram =>
            existingProgram.id === newProgram.id
          )
        );

        this.allLoadedPrograms = [...this.allLoadedPrograms, ...newPrograms];
        this.programs = this.allLoadedPrograms; // Or just response.content if you're replacing
        this.totalRecords = response.page.totalElements;
        this.totalPages = response.page.totalPages;
        
        // Update carousel items only if there are programs
        if (this.programs.length > 0) {
          this.updateCarouselItems();
        } else {
          this.carouselItems = []; // Ensure carouselItems is empty if no programs
        }
        this.loading = false;
        this.isLoadingMore = false;
      },
      error: (error) => {
        console.error('Error loading started programs:', error);
        this.programs = []; // Ensure programs is empty on error
        this.carouselItems = [];
        this.loading = false;
        this.isLoadingMore = false;
      }
    });
  }

  updateCarouselItems() {
    const previousLength = this.carouselItems.length;
    this.carouselItems = this.programs.map(program => ({ type: 'program-card', program }));

    if (this.isLoadingMore && previousLength > 0) {
      setTimeout(() => {
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

    const totalLoadedItems = this.allLoadedPrograms.length;
    const requestedItems = (this.page + 1) * this.rows;

    if (totalLoadedItems < requestedItems && totalLoadedItems < this.totalRecords) {
      this.loadStartedPrograms(this.page, this.rows);
    }
  }

  onCarouselPageChange(event: any) {
    this.currentCarouselPage = event.page;
    const numVisible = this.carousel && this.carousel.numVisible ? this.carousel.numVisible : 1; // Adjust based on actual numVisible if needed

    if (event.page >= (this.carouselItems.length - numVisible - 1) && // Check if near the end
      this.allLoadedPrograms.length < this.totalRecords &&
      !this.isLoadingMore) {
      this.isLoadingMore = true;
      this.page++; // This might need adjustment; ensure page corresponds to backend pagination
      this.loadStartedPrograms(this.page, this.rows);
    }
  }

  navigateToExplorePage(): void {
    this.router.navigate(['/search']); // Adjust '/explore' to your actual explore page route
  }
}