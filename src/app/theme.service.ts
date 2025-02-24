import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private darkMode = new BehaviorSubject<boolean>(false);
    darkMode$ = this.darkMode.asObservable();

    constructor() {
      if (typeof window !== 'undefined' && window.localStorage){
        // Initialize theme based on user preference or stored value
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.setDarkMode(savedTheme === 'dark');
        } else {
            // Optional: Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setDarkMode(prefersDark);
        }
      }
    }

    setDarkMode(isDark: boolean) {
        const html = document.querySelector('html');
        if (isDark) {
            html?.classList.add('dark-mode');
        } else {
            html?.classList.remove('dark-mode');
        }
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        this.darkMode.next(isDark);
    }

    toggleDarkMode() {
        this.setDarkMode(!this.darkMode.value);
    }
}
