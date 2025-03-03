export interface Program {
    id?: number;
    name: string;
    imageData?: any;
    creator?: any;
    followersNumber?: number;
    reviews?: Review[];
    rating?: number;
    weeks: Week[];
  }
  
  export interface Week {
    id?: number;
    workouts: Workout[];
  }
  
  export interface Workout {
    id?: number;
    title: string;
    description?: string;
    number?: string;
    workoutExercises: WorkoutExercise[];
  }
  
  export interface WorkoutExercise {
    id?: number;
    exercise: Exercise;
    workoutExerciseSets: WorkoutExerciseSet[];
  }
  
  export interface WorkoutExerciseSet {
    id?: number;
    volume: {
      minimumVolume: number;
      maximumVolume: number;
    };
    intensity: {
      minimumIntensity: number;
      maximumIntensity: number;
    };
    volumeMetric: VolumeMetric;
    intensityMetric: IntensityMetric;
  }
  
  
  export interface Exercise {
    id: number;
    title: string;
    description?: string;
    workedMuscles?: Muscle[];
  }

  export interface ExerciseOverview {
    id: number;
    title: string;
  }
  
  export interface Muscle {
    id: number;
    name: string;
  }
  
  export interface VolumeMetric {
    id: number;
    minimumMetric: number;
    maximumMetric: number;
    range:boolean;
    title: string;
    metricSymbol: string;
  }
  
  export interface IntensityMetric {
    id: number;
    minimumMetric: number;
    maximumMetric: number;
    range:boolean;
    title: string;
    metricSymbol: string;
  }
  
  export interface Review {
    id: number;
    rating: number;
    comment?: string;
    user?: any;
  }