import { Workout, WorkoutExercise, WorkoutExerciseSet } from "../program/program.model";

export interface NextWorkout {
    startedWorkout: StartedWorkout;
    action: string | null; // "start", "continue", or null
    message: string | null; // For messages like "Program completed"
}

export interface StartedWorkout {
    id: number;
    workout: Workout;
    doneSets: DoneSet[];
    startDate: Date;
    doneDate: Date | null;
    finished: boolean;
}

export interface DoneSet {
    id: number;
    set: WorkoutExerciseSet;
    workoutExercise: WorkoutExercise;
    volume: number;
    intensity: number;
    date: Date;
    weightLifted: number | null;
}