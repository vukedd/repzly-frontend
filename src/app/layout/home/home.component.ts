import { Component, HostListener, OnInit } from '@angular/core';
import { MuscleTrackerComponent } from "../../body-highlighter/muscle-tracker/muscle-tracker.component";
import { VolumeGraphComponent } from "../../volume-graph/volume-graph.component";
import { JwtService } from '../../auth/jwt/jwt.service';
import { ProgramListHorizontalComponent } from "../../program/program-list-horizontal/program-list-horizontal.component";
import { ButtonModule } from 'primeng/button';
import { WorkoutDurationGraphComponent } from "../../workout-duration-graph/workout-duration-graph.component";
import { CommonModule } from '@angular/common';
import confetti from 'canvas-confetti';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-home',
  imports: [MuscleTrackerComponent,
    VolumeGraphComponent,
    ProgramListHorizontalComponent,
    ButtonModule,
    WorkoutDurationGraphComponent,
    CommonModule,
    DialogModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(public jwtService: JwtService,
    private breakpointObserver: BreakpointObserver
  ) { }

  showCongratsDialog: boolean = false;
  showInputButtons = false;
  private destroy$ = new Subject<void>();


  ngOnInit(): void {
    const state = history.state as { workoutJustCompleted?: boolean };

    if (state && state.workoutJustCompleted) {
      this.triggerCelebration();
      const newHistoryState = { ...history.state };
      delete newHistoryState.workoutJustCompleted;
      history.replaceState(newHistoryState, '');
    }
    this.breakpointObserver
      .observe(['(min-width: 768px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.showInputButtons = result.matches;
      });
  }

  triggerCelebration(): void {
    this.showCongratsDialog = true;
    this.launchConfetti();
  }

  launchConfetti(): void {
    const duration = 3 * 1000; // 3 seconds
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1050 }; // zIndex higher than dialog overlay

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  }



  isLoggedIn(): boolean {
    return this.jwtService.isLoggedIn()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
