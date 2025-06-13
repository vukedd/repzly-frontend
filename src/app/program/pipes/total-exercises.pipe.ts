import { Pipe, PipeTransform } from '@angular/core';
import { Program } from '../program.model';

@Pipe({
  name: 'totalExercises'
})
export class TotalExercisesPipe implements PipeTransform {

  transform(program:Program): unknown {
    if (!program?.weeks) return 0;
    return program.weeks.reduce((weekTotal: number, week: any) => {
      if (!week.workouts) return weekTotal;
      return weekTotal + week.workouts.reduce((workoutTotal: number, workout: any) => {
        return workoutTotal + (workout.workoutExercises?.length || 0);
      }, 0);
    }, 0);
  }

}
