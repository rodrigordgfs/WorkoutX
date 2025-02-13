import { useClerk } from "@clerk/clerk-react";
import { LoaderIcon, Plus, PlusIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { useWorkout } from "@/context/WorkoutContext";

interface Exercise {
    name: string;
    series: string;
    repetitions: string;
    weight: string;
    restTime: string;
    videoUrl: string;
    instructions: string;
}

const initialExercise: Exercise = {
    name: '',
    series: '',
    repetitions: '',
    weight: '',
    restTime: '',
    videoUrl: '',
    instructions: ''
};


const WorkoutRegisterPage = () => {
    const clerk = useClerk();
    const { addWorkout } = useWorkout();

    const [workoutName, setWorkoutName] = useState('');
    const [exercises, setExercises] = useState<Exercise[]>([{ ...initialExercise }]);
    const [loading, setLoading] = useState(false);
    const [userId] = useState(clerk.user?.id ?? "");

    const addExercise = () => {
        setExercises([...exercises, { ...initialExercise }]);
    };

    const removeExercise = (index: number) => {
        setExercises(exercises.filter((_, i) => i !== index));
    };

    const updateExercise = (index: number, field: keyof Exercise, value: string | number) => {
        const updatedExercises = exercises.map((exercise, i) => {
            if (i === index) {
                return { ...exercise, [field]: value };
            }
            return exercise;
        });
        setExercises(updatedExercises);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        addWorkout(workoutName, userId, exercises).then(() => {
            clearFields();
        })
            .finally(() => {
                setLoading(false);
            })
    };

    const clearFields = () => {
        setWorkoutName('');
        setExercises([{ ...initialExercise }]);
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <PlusIcon size={24} />
                </div>
                <h2 className="text-2xl font-bold">Meus Treinos</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                    <label className="block mb-4">
                        <span className="text-gray-700">Nome do Treino</span>
                        <input
                            type="text"
                            value={workoutName}
                            onChange={(e) => setWorkoutName(e.target.value)}
                            className="mt-1 px-4 py-2 bg-zinc-100 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            placeholder="Ex: Treino A - Peito e Tríceps"
                            required
                            disabled={loading}
                        />
                    </label>
                </div>

                {exercises.map((exercise, index) => (
                    <div key={index} className="bg-white rounded-lg p-6 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Exercício {index + 1}</h3>
                            {exercises.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeExercise(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-gray-700">Nome do Exercício</span>
                                <input
                                    type="text"
                                    value={exercise.name}
                                    onChange={(e) => updateExercise(index, 'name', String(e.target.value))}
                                    className="mt-1 px-4 py-2 bg-zinc-100 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    required
                                    disabled={loading}
                                />
                            </label>

                            <label className="block">
                                <span className="text-gray-700">URL do Vídeo</span>
                                <input
                                    type="url"
                                    value={exercise.videoUrl}
                                    onChange={(e) => updateExercise(index, 'videoUrl', String(e.target.value))}
                                    className="mt-1 px-4 py-2 bg-zinc-100 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    required
                                    disabled={loading}
                                />
                            </label>

                            <label className="block">
                                <span className="text-gray-700">Séries</span>
                                <input
                                    value={exercise.series}
                                    onChange={(e) => updateExercise(index, 'series', String(e.target.value))}
                                    className="mt-1 px-4 py-2 bg-zinc-100 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    required
                                    disabled={loading}
                                />
                            </label>

                            <label className="block">
                                <span className="text-gray-700">Repetições</span>
                                <input
                                    value={exercise.repetitions}
                                    onChange={(e) => updateExercise(index, 'repetitions', String(e.target.value))}
                                    className="mt-1 px-4 py-2 bg-zinc-100 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    required
                                    disabled={loading}
                                />
                            </label>

                            <label className="block">
                                <span className="text-gray-700">Peso (kg)</span>
                                <input
                                    value={exercise.weight}
                                    onChange={(e) => updateExercise(index, 'weight', String(e.target.value))}
                                    className="mt-1 px-4 py-2 bg-zinc-100 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    min="0"
                                    required
                                    disabled={loading}
                                />
                            </label>

                            <label className="block">
                                <span className="text-gray-700">Tempo de Descanso (segundos)</span>
                                <input
                                    value={exercise.restTime}
                                    onChange={(e) => updateExercise(index, 'restTime', String(e.target.value))}
                                    className="mt-1 px-4 py-2 bg-zinc-100 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    min="0"
                                    required
                                    disabled={loading}
                                />
                            </label>

                            <label className="block md:col-span-2">
                                <span className="text-gray-700">Instruções</span>
                                <textarea
                                    value={exercise.instructions}
                                    onChange={(e) => updateExercise(index, 'instructions', String(e.target.value))}
                                    className="mt-1 px-4 py-2 bg-zinc-100 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    rows={3}
                                    required
                                    disabled={loading}
                                />
                            </label>
                        </div>
                    </div>
                ))}

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={addExercise}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                        <Plus size={20} />
                        Adicionar Exercício
                    </button>

                    <button
                        type="submit"
                        className={`flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${loading && 'opacity-75'}`}
                        disabled={loading}
                    >
                        {loading ? <div className="flex items-center gap-2">
                            <LoaderIcon size={20} className="animate-spin mr-2" />
                            Salvando
                        </div> : 'Salvar Treino'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default WorkoutRegisterPage;