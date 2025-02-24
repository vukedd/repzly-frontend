import { Component, Input, OnInit } from '@angular/core';
import { ProgramOverviewDTO } from '../program-overview-dto';
import { CardModule } from 'primeng/card';
import {ButtonModule} from 'primeng/button' 
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-program-card',
  imports: [CardModule,ButtonModule,RatingModule,CommonModule,FormsModule],
  templateUrl: './program-card.component.html',
  styleUrl: './program-card.component.css'
})
export class ProgramCardComponent implements OnInit {
  @Input() program!: ProgramOverviewDTO;
  @Input() showLikeCount: boolean = true;
  
  isFollowed: boolean = false;
  iconClass = 'pi pi-heart';
  followTextClass="Follow";
  followSeverity: 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast' | null | undefined = 'secondary';
  
  constructor(
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.iconClass = !this.isFollowed ? 'pi pi-heart' : 'pi pi-heart-fill';
    this.followTextClass=!this.isFollowed?"Follow":"Unfollow";
    this.followSeverity=!this.isFollowed?'primary' :'secondary';
  }
  
  get programImage(): SafeUrl {
    if (this.program.imageData) {
      const imageDataString = this.arrayBufferToBase64(this.program.imageData);
      return this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + imageDataString);
    }
    return 'assets/default-program.jpg'; // Fallback image
  }
  
  navigateToDetails(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate(['/programs', this.program.id]);
  }
  
  toggleLike(event: Event): void {
    event.stopPropagation(); // Prevent card click when clicking like button
    console.log(this.isFollowed);
    this.isFollowed = !this.isFollowed;
    this.iconClass = !this.isFollowed ? 'pi pi-heart' : 'pi pi-heart-fill';
    this.followTextClass=!this.isFollowed?"Follow":"Unfollow";
    this.followSeverity=!this.isFollowed?"primary":"secondary";

    // Here you would add API call to like/unlike the program
  }
  
  private arrayBufferToBase64(buffer: any): string {
    if (typeof window !== 'undefined' && window.localStorage){
    if (!buffer) return '';
    
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    
    return window.btoa(binary);
  }
  return "";
  }

  
}
