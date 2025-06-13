import { Pipe, PipeTransform } from '@angular/core';
import { Program } from '../program.model';

@Pipe({
  name: 'totalSets'
})
export class TotalSetsPipe implements PipeTransform {

  transform(program: Program): unknown {
    if (!program?.weeks) return 0;

    return program.weeks.reduce((weekTotal: number, week: any) => {
      if (!week.workouts) return weekTotal;

      return weekTotal + week.workouts.reduce((workoutTotal: number, workout: any) => {
        if (!workout.workoutExercises) return workoutTotal;

        return workoutTotal + workout.workoutExercises.reduce((exerciseTotal: number, exercise: any) => {
          return exerciseTotal + (exercise.sets?.length || 0);
        }, 0);
      }, 0);
    }, 0);
  }

}
