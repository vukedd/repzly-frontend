export interface Program {
    id?: number;
    name: string;
    creator?: any;
    followersNumber?: number;
    reviews?: Review[];
    rating?: number;
    weeks: Week[];
    createdByUser?:boolean;
  }
  
  export interface Week {
    id?: number;
    workouts: Workout[];
  }
  
  export interface Workout {
    id?: number;
    title: string;
    description?: string;
    workoutExercises: WorkoutExercise[];
  }
  
  export interface WorkoutExercise {
    id?: number;
    exercise: Exercise;
    minimumRestTime:number;
    maximumRestTime:number;
    sets: WorkoutExerciseSet[];
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
    link?:string;
  }

  export interface ExerciseOverview {
    id: number;
    title: string;
    link:string;
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