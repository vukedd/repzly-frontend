import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';


@Component({
  selector: 'app-sidebar',
  imports: [DrawerModule,MenuModule,ButtonModule,CommonModule,RouterModule,AvatarGroupModule,AvatarModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent {
  username: string = 'John';
  email: string = 'Doe';
  photo: string = 'dinja.jpg';
  role: string = '';

  //constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    // this.userService.getCurrentUser().subscribe(
    //   (userData) => {
    //     this.username = userData.username;
    //     this.email = userData.email;
    //     this.photo = userData.profilePhoto || '/assets/default-avatar.png';
    //     this.role = userData.role;
    //   },
    //   (error) => {
    //     console.error('Error loading user data:', error);
    //   }
    // );
  }
}
