import { IWorkoutHistory } from "@/components/WorkoutHistoryPage/WorkoutHistoryCard";
import { Visibility } from "@/pages/WorkoutRegister";
import workoutService from "@/services/workout";
import { useClerk } from "@clerk/clerk-react";
import axios from "axios";
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { toast } from "react-toastify";

export interface Workout {
  id: string;
  name: string;
  user: User;
  visibility: Visibility;
  exercises: Exercise[];
  likes: WorkoutLikes[];
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface WorkoutStats {
  totalExercises: number;
  completedExercises: number;
  completionRate: string;
}

export interface WorkoutHistory {
  id: string;
  startedAt: string;
  endedAt: string | null;
  duration: string | number;
  workout: {
    name: string;
    visibility: string;
    createdAt: string;
  };
  exercises: Exercise[];
  stats: WorkoutStats;
}

export interface WorkoutLikes {
  userId: string;
}

export interface Exercise {
  id?: string | undefined;
  name: string;
  series: string;
  repetitions: string;
  weight: string;
  restTime: string;
  videoUrl: string;
  instructions: string;
}

export interface ExerciseSession {
  id: string;
  series: string;
  repetitions: string;
  weight: string;
  restTime: string;
  completed: boolean;
  exercise: {
    id: string;
    name: string;
  };
}

export interface WorkoutSession {
  id: string;
  startedAt: string;
  endedAt: string | null;
  exercises: ExerciseSession[];
}

interface WorkoutContextType {
  workouts: Workout[];
  fetchWorkouts: (userId?: string | undefined) => void;
  workoutsLoaded: boolean;
  addWorkout: (
    name: string,
    visibility: Visibility,
    userId: string,
    exercises: Exercise[]
  ) => Promise<void>;
  appendWorkout: (workout: Workout) => void;
  isWorkoutsEmpty: () => boolean;
  loadingWorkouts: boolean;
  selectedExercise: Exercise | null;
  setSelectedExercise: (exercise: Exercise | null) => void;
  setSelectedWorkout: (workout: Workout | null) => void;
  selectedWorkout: Workout | null;
  deleteExercise: (exerciseId: string) => void;
  deleteWorkout: (workoutId: string) => void;
  isLastExerciseInWorkout: (
    workout: Workout | undefined,
    exerciseId: string
  ) => boolean;
  getWorkoutByExerciseId: (exerciseId: string) => Workout | undefined;
  workoutSession: WorkoutSession | null;
  setWorkoutSession: (workoutSession: WorkoutSession | null) => void;
  workoutSessionInProgress: () => boolean;
  workoutSessionCompleted: () => boolean;
  existExercisesUncompleted: () => boolean | undefined;
  getUncompletedExercisesWithDetails: () => Exercise[] | undefined;
  getCompletedExercisesWithDetails: () => Exercise[] | undefined;
  loadingWorkoutHistory: boolean;
  fetchWorkoutHistory: () => void;
  workoutHistory: IWorkoutHistory[];
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

interface WorkoutProviderProps {
  children: ReactNode;
}

export const WorkoutProvider: FC<WorkoutProviderProps> = ({ children }) => {
  const { user } = useClerk();

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [workoutsLoaded, setWorkoutsLoaded] = useState(false);
  const [loadingWorkouts, setLoadingWorkouts] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [workoutSession, setWorkoutSession] = useState<WorkoutSession | null>(
    null
  );
  const [loadingWorkoutHistory, setLoadingWorkoutHistory] = useState(false);
  const [workoutHistory, setWorkoutHistory] = useState<IWorkoutHistory[]>([]);

  const getUncompletedExercisesWithDetails = () => {
    return workoutSession?.exercises
      .filter((exerciseSession) => !exerciseSession.completed)
      .map((exerciseSession) => {
        const workout = workouts.find((workout) =>
          workout.exercises.some(
            (exercise) => exercise.id === exerciseSession.exercise.id
          )
        );

        const exercise = workout?.exercises.find(
          (exercise) => exercise.id === exerciseSession.exercise.id
        );

        return exercise;
      })
      .filter((exercise) => exercise !== undefined);
  };

  const getCompletedExercisesWithDetails = () => {
    return workoutSession?.exercises
      .filter((exerciseSession) => exerciseSession.completed)
      .map((exerciseSession) => {
        const workout = workouts.find((workout) =>
          workout.exercises.some(
            (exercise) => exercise.id === exerciseSession.exercise.id
          )
        );

        const exercise = workout?.exercises.find(
          (exercise) => exercise.id === exerciseSession.exercise.id
        );

        return exercise;
      })
      .filter((exercise) => exercise !== undefined);
  };

  const workoutSessionInProgress = () => {
    return workoutSession !== null && workoutSession.endedAt === null;
  };

  const workoutSessionCompleted = () => {
    return workoutSession !== null && workoutSession.endedAt !== null;
  };

  const existExercisesUncompleted = () => {
    return workoutSession?.exercises.some((exercise) => !exercise.completed);
  };

  const getWorkoutByExerciseId = (exerciseId: string) => {
    return workouts.find((workout) =>
      workout.exercises.some((exercise) => exercise.id === exerciseId)
    );
  };

  const isLastExerciseInWorkout = (
    workout: Workout | undefined,
    exerciseId: string
  ) => {
    return (
      workout?.exercises.length === 1 && workout?.exercises[0].id === exerciseId
    );
  };

  const deleteExercise = async (exerciseId: string) => {
    const updatedWorkouts = workouts.map((workout) => {
      const updatedExercises = workout.exercises.filter(
        (exercise) => exercise.id !== exerciseId
      );
      return { ...workout, exercises: updatedExercises };
    });
    setWorkouts(updatedWorkouts);
    setSelectedExercise(
      selectedWorkout?.exercises[0] ?? updatedWorkouts[0].exercises[0]
    );
    toast.success("Exercício deletado com sucesso");
  };

  const deleteWorkout = async (workoutId: string) => {
    const updatedWorkouts = workouts.filter(
      (workout) => workout.id !== workoutId
    );
    setWorkouts(updatedWorkouts);
    setSelectedWorkout(null);
    toast.success("Treino deletado com sucesso");
  };

  const isWorkoutsEmpty = () => {
    return workouts.length === 0;
  };

  const appendWorkout = (workout: Workout) => {
    setWorkouts([...workouts, workout]);
  };

  const fetchWorkouts = async (userId?: string | undefined) => {
    setLoadingWorkouts(true);
    workoutService
      .get({ userId })
      .then(({ data }) => {
        setWorkouts(data);
        setWorkoutsLoaded(true);
        setLoadingWorkouts(false);
      })
      .catch((error) => {
        setWorkoutsLoaded(false);
        const title = error.response?.data?.message;
        const errors: Record<string, { field: string; message: string }> =
          error.response?.data?.errors;
        if (errors) {
          Object.values(errors).forEach((errorMessages) => {
            toast.error(errorMessages.message);
          });
        } else {
          toast.error(title || "Erro ao buscar os treinos");
        }
      });
  };

  const addWorkout = async (
    name: string,
    visibility: Visibility,
    userId: string,
    exercises: Exercise[]
  ) => {
    return workoutService
      .post({ name, userId, visibility, exercises })
      .then(({ data }) => {
        setWorkouts([...workouts, data]);
        toast.success("Treino cadastrado com sucesso");
      })
      .catch((error) => {
        const title = error.response?.data?.message;
        const errors: Record<string, { field: string; message: string }> =
          error.response?.data?.errors;

        if (errors) {
          Object.values(errors).forEach((errorMessages) => {
            toast.error(errorMessages.message);
          });
        } else {
          toast.error(title || "Erro ao cadastrar treino");
        }
      });
  };

  const fetchWorkoutHistory = useCallback(() => {
    setLoadingWorkoutHistory(true);
    axios
      .get("/workout/history", {
        baseURL: import.meta.env.VITE_API_BASE_URL,
        params: {
          userId: user?.id,
        },
      })
      .then(({ data }) => {
        setWorkoutHistory(data);
        setLoadingWorkoutHistory(false);
      })
      .catch((error) => {
        const title = error.response?.data?.message;
        const errors: Record<string, { field: string; message: string }> =
          error.response?.data?.errors;
        if (errors) {
          Object.values(errors).forEach((errorMessages) => {
            toast.error(errorMessages.message);
          });
        } else {
          toast.error(title || "Erro ao buscar o histórico de treinos");
        }
      });
  }, [user?.id]);

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        fetchWorkouts,
        addWorkout,
        workoutsLoaded,
        appendWorkout,
        isWorkoutsEmpty,
        loadingWorkouts,
        selectedExercise,
        setSelectedExercise,
        selectedWorkout,
        setSelectedWorkout,
        deleteExercise,
        deleteWorkout,
        getWorkoutByExerciseId,
        isLastExerciseInWorkout,
        workoutSession,
        setWorkoutSession,
        workoutSessionInProgress,
        workoutSessionCompleted,
        existExercisesUncompleted,
        getUncompletedExercisesWithDetails,
        getCompletedExercisesWithDetails,
        loadingWorkoutHistory,
        fetchWorkoutHistory,
        workoutHistory,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = (): WorkoutContextType => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context;
};
