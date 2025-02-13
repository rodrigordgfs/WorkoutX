import { Link } from 'react-router-dom';
import { Plus, ChevronRight, Dumbbell, Weight, Timer, Repeat } from 'lucide-react';
import { useWorkout } from '@/context/WorkoutContext';

export function WorkoutsListPage() {
    const { workouts } = useWorkout();

    if (workouts.length === 0) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Meus Treinos</h2>
                    <Link
                        to="/workout/new"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        Novo Treino
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Dumbbell size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum treino cadastrado</h3>
                    <p className="text-gray-600 mb-6">
                        Comece criando seu primeiro treino para acompanhar seus exercícios.
                    </p>
                    <Link
                        to="/workout/new"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        Criar Primeiro Treino
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <Dumbbell size={24} />
                    </div>
                    <h2 className="text-2xl font-bold">Meus Treinos</h2>
                </div>
                <Link
                    to="/workout/new"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    Novo Treino
                </Link>
            </div>

            <div className="grid gap-4">
                {workouts.map((wk) => (
                    <div key={wk.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                        <Dumbbell size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">{wk.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {wk?.exercises?.length} exercício{wk?.exercises?.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100">
                            <div className="grid divide-y divide-gray-100">
                                {wk?.exercises?.map((exercise) => (
                                    <div key={exercise.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                                                <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Repeat size={16} className="text-blue-500" />
                                                        <span>{exercise.series} séries x {exercise.repetitions} reps</span>
                                                    </div>
                                                    {exercise.weight && (
                                                        <div className="flex items-center gap-1">
                                                            <Weight size={16} className="text-blue-500" />
                                                            <span>{exercise.weight}kg</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1">
                                                        <Timer size={16} className="text-blue-500" />
                                                        <span>{exercise.restTime}s descanso</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Link
                            to={`/workout/${wk.id}`}
                            className="block p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-center text-blue-600 font-medium"
                        >
                            Ver detalhes do treino
                            <ChevronRight className="inline-block ml-2" size={16} />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}