import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ThemeService } from '../../theme.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';


@Component({
  selector: 'app-header',
  imports: [ButtonModule, ToolbarModule, CommonModule, FormsModule, MenubarModule, DrawerModule,SidebarComponent,InputTextModule,InputGroupModule,InputGroupAddonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit{
  sidemenuVisible:boolean=false;
  isDarkMode = false;
  searchText:string='';
  items: MenuItem[] | undefined;
  constructor(private themeService: ThemeService) {
      this.themeService.darkMode$.subscribe(
          isDark => this.isDarkMode = isDark
      );
    } 
  ngOnInit(): void {
    this.items = [
      {
        label: 'johndoe@example.com',
        icon: '',
        items: [
          {
            label: 'Profile',
            icon: 'pi pi-user',
            
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            
          },
        ],
      },
    ];
  }
  toggleTheme() {
    this.themeService.toggleDarkMode();
  }
  onSearchChange() {
    //this.searchService.updateSearch(this.searchText);
  }
  
 
}
