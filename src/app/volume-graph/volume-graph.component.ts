import { Component } from '@angular/core';
import { ChartOptions, ChartData} from 'chart.js';
import { ChartModule } from 'primeng/chart';
import { JwtService } from '../auth/jwt/jwt.service';
import { DailyVolumeReport } from './model/daily-volume-report';
import { VolumeService } from '../body-highlighter/volume.service';

@Component({
  selector: 'app-volume-graph',
  imports: [ChartModule],
  templateUrl: './volume-graph.component.html',
  styleUrl: './volume-graph.component.css'
})
export class VolumeGraphComponent {
  setsChartData: ChartData<'line'> | undefined;
  setsChartOptions: ChartOptions | undefined;
  userSetsData: DailyVolumeReport[] = [];

  constructor(private volumeService: VolumeService, private jwtService: JwtService) {}


  ngOnInit() {
    if (this.jwtService.isLoggedIn()) {
      let endDate = new Date();
      let startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
  
      const formatDate = (date: Date): string => date.toISOString().split('T')[0];
  
      this.volumeService.getProgramWeeklyVolume(formatDate(startDate), formatDate(endDate)).subscribe({
        next: (response) => {
          this.userSetsData = response.reverse();
  
          const labels = this.userSetsData.map(entry => entry.date.toString());
          const data = this.userSetsData.map(entry => entry.sets);
  
          this.setsChartData = {
            labels: labels,
            datasets: [
              {
                label: 'Sets Per Day',
                data: data,
                borderColor: '#2563EB',
                fill: false,
                pointBackgroundColor: '#2563EB',
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
                    const sets = context.raw;
                    return `${sets} sets`;
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