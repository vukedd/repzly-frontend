import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ThemeService } from '../../theme.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem, MessageService, PrimeIcons } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { JwtService } from '../../auth/jwt/jwt.service';
// import { DialogModule } from 'primeng/dialog'; // Remove
import { RegisterFormComponent } from "../../user/register/register-form/register-form.component";
import { LoginFormComponent } from "../../user/login/login-form/login-form.component";
import { ToastModule } from 'primeng/toast';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuModule } from 'primeng/menu';
import { RouterLink, RouterModule } from '@angular/router';
import { ToastsPositionService } from '../toasts/toasts-position.service';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog'; // Import DynamicDialog related services

@Component({
  selector: 'app-header',
  imports: [
    ButtonModule,
    ToolbarModule,
    CommonModule,
    FormsModule,
    MenubarModule,
    DrawerModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    // DialogModule, // Removed
    DynamicDialogModule, // Add
    ToastModule,
    PanelMenuModule,
    MenuModule,
    RouterLink,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers:  [MessageService, DialogService], // Add DialogService
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, OnDestroy {

  sidemenuVisible:boolean=false;
  isDarkMode = false;
  searchText:string='';
  items: MenuItem[] | undefined;
  // visible: boolean = false; // Removed
  isLoginMode: boolean = true; // Used to determine which dialog to open initially
  isSearchPossible = false;
  ref: DynamicDialogRef | undefined;

  constructor(
    private themeService: ThemeService,
    private jwtService: JwtService,
    private messageService: MessageService,
    public toastsPositionService: ToastsPositionService,
    private dialogService: DialogService // Inject DialogService
  ) {
    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  ngOnInit(): void {
    this.setupControls();
  }

  showAuthDialog() {
    const componentToShow = this.isLoginMode ? LoginFormComponent : RegisterFormComponent;
    const headerText = this.isLoginMode ? 'Sign in' : 'Sign up';

    this.ref = this.dialogService.open(componentToShow as any, {
        header: headerText,
         // Responsive width
        contentStyle: { "max-height": "90vh", "overflow-y": "auto" },
        baseZIndex: 10000,
        modal:true,
        maskStyleClass: 'backdrop-blur-sm',
        styleClass:'md:w-auto w-full',
        dismissableMask: true,
        closable: false
    });

    this.ref.onClose.subscribe((result: any) => {
      if (result) {
        if (result.modeChangedTo) {
          // Handle mode change (re-open dialog in the new mode)
          this.isLoginMode = result.modeChangedTo === 'login';
          // Set timeout to allow current dialog closing animation to finish slightly before opening new one
          setTimeout(() => this.showAuthDialog(), 100);
        } else if (result.loginSuccess) {
          // Handle login success (e.g., update header controls)
          this.handleLoginSuccess(result.loginSuccess); // This already shows a toast and updates controls
        } else if (result.registerSuccess) {
          // Registration was successful, show the success message passed back from RegisterForm
          this.messageService.add({ severity: 'success', summary: 'Success', detail: result.registerSuccess });
          this.isLoginMode = true; // Prepare for next dialog open to be login
          // Optionally auto-open login dialog after successful registration:
          // setTimeout(() => this.showAuthDialog(), 100);
        }
        // No need to handle loginError or registerError here anymore
      }
      // Clear the reference when the dialog is closed for any reason
      this.ref = undefined;
    });
    
  }

  // closeDialog() // Not needed anymore, handled by DynamicDialogRef or child components

  // handleModeChange(value: boolean) // Logic moved to onClose subscription

  handleRegisterError(errorMessage: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
  }

  // handleRegisterSuccess is effectively handled by the onClose subscription for result.registerSuccess

  handleLoginError(statusCode: number) {
    switch (statusCode) {
      case 401:
        this.messageService.add({ severity: 'error', summary: "Error", detail: "The credentials you have entered are invalid!"});
        break;
      case 403:
        this.messageService.add({ severity: 'error', summary: "Error", detail: "Before you continue, please verify your account!"});
        break;
      default:
        this.messageService.add({ severity: 'error', summary: "Error", detail: "An error occurred, please try later!"});
    }
  }

  handleLoginSuccess(statusCode: number) {
    if (statusCode == 200) {
      this.messageService.add({severity: 'success', summary: "Success", detail: "You have successfully logged in!"});
      // this.visible=false; // Removed
      this.setupControls();
      // The dialog is closed by the LoginFormComponent itself upon success.
    }
  }

  setupControls():void{
    if (this.jwtService.isLoggedIn()){
      this.jwtService.getLoggedInUser().subscribe(
        {
          next: (response) => {
            this.items = [
              {
                label: `${response.username}`, // Corrected template literal
                icon: PrimeIcons.USER,
                items: [
                  {
                    label: 'Profile',
                    icon: 'pi pi-user',
                    routerLink: 'me'
                  },
                  {
                    label: 'Logout',
                    icon: PrimeIcons.SIGN_OUT,
                    command: () => {
                      this.logout();
                    }
                  },
                ],
              },
            ];
          },
          error: (error) => {
            // email = "Error"; // 'email' was not used, removing for clarity
            console.error("Error fetching user details for header:", error);
            // Fallback or error display for items if needed
             this.items = [ { label: 'User Error', icon: PrimeIcons.EXCLAMATION_TRIANGLE }];
          }
        }
      );
    } else {
        this.items = undefined; // Ensure items are cleared if not logged in
    }
  }

  logout(){
    this.jwtService.logout();
    this.items = undefined; // Clear user-specific menu items
    window.location.href = ''; // Or use Angular Router for navigation
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
  }

  ngOnDestroy() {
    if (this.ref) {
        this.ref.close();
    }
  }
}