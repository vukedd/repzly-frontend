import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTermSource = new BehaviorSubject<string>('');
  private programsType = new BehaviorSubject<string>('');
  
  currentSearchTerm = this.searchTermSource.asObservable();

  currentProgramsType = this.programsType.asObservable();

  updateSearchTerm(term: string) {
    this.searchTermSource.next(term);
  }

  updateProgramsType(type: string) {
    this.programsType.next(type);
  }
}
