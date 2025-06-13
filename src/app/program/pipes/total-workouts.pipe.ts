import { Pipe, PipeTransform } from '@angular/core';
import { Program } from '../program.model';

@Pipe({
  name: 'totalWorkouts'
})
export class TotalWorkoutsPipe implements PipeTransform {

  transform(program: Program): unknown {
    if (!program || !program.weeks) {
      return 0;
    }

    return program.weeks.reduce((total, week) => {
      return total + (week.workouts?.length || 0);
    }, 0);
  }

}
