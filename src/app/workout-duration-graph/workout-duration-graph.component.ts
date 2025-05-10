import { Component } from '@angular/core';
import { ChartOptions, ChartData} from 'chart.js';
import { ChartModule } from 'primeng/chart';
import { DailyWorkoutDurationReport } from './model/daily-workout-duration-report';
import { VolumeService } from '../body-highlighter/volume.service';
import { JwtService } from '../auth/jwt/jwt.service';

@Component({
  selector: 'app-workout-duration-graph',
  imports: [ChartModule],
  templateUrl: './workout-duration-graph.component.html',
  styleUrl: './workout-duration-graph.component.css'
})
export class WorkoutDurationGraphComponent {
    setsChartData: ChartData<'line'> | undefined;
    setsChartOptions: ChartOptions | undefined;
    userSetsData: DailyWorkoutDurationReport[] = [];
  
    constructor(private volumeService: VolumeService, private jwtService: JwtService) {}
    

    ngOnInit() {
      if (this.jwtService.isLoggedIn()) {
        let endDate = new Date();
        let startDate = new Date();
        endDate.setDate(endDate.getDate());
        startDate.setDate(endDate.getDate() - 7);
    
        const formatDate = (date: Date): string => date.toISOString().split('T')[0];
    
        this.volumeService.getWeeklyWorkoutDurationReport(formatDate(startDate), formatDate(endDate)).subscribe({
          next: (response) => {
            this.userSetsData = response.reverse();
    
            const labels = this.userSetsData.map(entry => entry.date.toString());
            const data = this.userSetsData.map(entry => entry.duration);
    
            this.setsChartData = {
              labels: labels,
              datasets: [
                {
                  label: 'Hours Per Day',
                  data: data,
                  borderColor: '#10b981',
                  fill: false,
                  pointBackgroundColor: '#10b981',
                  tension: 0.4
                }
              ]
            };
    
            this.setsChartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              aspectRatio:0.8,
              plugins: {
                legend: {
                  labels: { color: '#b0aeae' }
                },
                tooltip: {
                  callbacks: {
                    label: (context: any) => {
                      const hours = context.raw;
                      return `${hours} hours`;
                    }
                  }
                }
              },
              scales: {
                x: {
                  type: 'category',
                  labels: labels,
                  ticks: {
                    color: '#b0aeae',
                    maxRotation: 30,
                    autoSkip: false,
                    font: {
                      size: 10,
                    }
                  },
                  grid: { color: '#b0aeae' }
                },
                y: {
                  ticks: { color: '#b0aeae'},
                  grid: { color: '#b0aeae' },
                  beginAtZero: true
                }
              }
            };
          }
        });
      }
    }
}
