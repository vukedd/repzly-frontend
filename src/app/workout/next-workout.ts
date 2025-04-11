import { Workout, WorkoutExercise, WorkoutExerciseSet } from "../program/program.model";

export interface NextWorkout {
    nextWorkoutDetails: StartedWorkout;
    action: string | null; // "start", "continue", or null
    message: string | null; // For messages like "Program completed"
}

export interface StartedWorkout {
    id: number;
    title: string;
    description?: string;
    number?: string;
    workoutId:number;
    workoutExercises: WorkoutExercise[];
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