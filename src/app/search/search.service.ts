import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTermAllProgramsSource = new BehaviorSubject<string>('');
  private searchTermMyProgramsSource = new BehaviorSubject<string>('');
  private programsType = new BehaviorSubject<string>('');
  
  currentSearchTerm = this.searchTermAllProgramsSource.asObservable();

  currentProgramsType = this.programsType.asObservable();

  updateSearchTerm(term: string) {
    this.searchTermAllProgramsSource.next(term);
  }

  updateProgramsType(type: string) {
    this.programsType.next(type);
  }
}
