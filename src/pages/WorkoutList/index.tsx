import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useWorkout } from '@/context/WorkoutContext';
import { useState } from 'react';
import WorkoutEmpty from '../../components/WorkoutEmpty';
import WorkoutLoading from '../../components/WorkoutLoading';
import WorkoutListItem from '@/components/WorkoutListItem';

export function WorkoutsListPage() {
    const { workouts, isWorkoutsEmpty, loadingWorkouts } = useWorkout();
    const [openWorkouts, setOpenWorkouts] = useState<string[]>([]);

    const toggleWorkout = (workoutId: string) => {
        setOpenWorkouts(current =>
            current.includes(workoutId)
                ? current.filter(id => id !== workoutId)
                : [...current, workoutId]
        );
    };

    if (loadingWorkouts) {
        return (
            <WorkoutLoading />
        );
    }

    if (isWorkoutsEmpty()) {
        return (
            <WorkoutEmpty />
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Meus Treinos</h2>
                <Link to="/workout/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus size={20} />
                    Novo Treino
                </Link>
            </div>
            <div className="grid gap-4">
                {workouts.map((wk) => {
                    const isOpen = openWorkouts.includes(wk.id);
                    return (
                        <WorkoutListItem workout={wk} isOpen={isOpen} onToggle={toggleWorkout} />
                    );
                })}
            </div>
        </div>
    );
}
