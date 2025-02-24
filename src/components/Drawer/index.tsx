import { useUserProfile } from "@/context/UserContext";
import { useClerk } from "@clerk/clerk-react";
import {
  X,
  Dumbbell,
  Plus,
  User,
  Users,
  LogOut,
  Calendar,
  LayoutDashboard,
} from "lucide-react";
import { Link } from "react-router-dom";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Drawer({ isOpen, onClose }: DrawerProps) {
  const { profile } = useUserProfile();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-md z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-zinc-900 shadow-lg transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <header className="bg-blue-600 dark:bg-blue-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 hover:bg-blue-700 dark:hover:bg-blue-800 rounded-full p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          >
            <X size={24} />
            <span className="sr-only">Fechar menu</span>
          </button>

          <div className="flex items-center gap-4 mt-4">
            <div className="relative h-12 w-12">
              {profile.avatar ? (
                <img
                  src={profile.avatar || "/placeholder.svg"}
                  alt={profile.name}
                  className="rounded-full w-full h-full object-cover border-2 border-white"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-blue-700 dark:bg-blue-800 border-2 border-white flex items-center justify-center text-lg font-semibold">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h2 className="font-semibold text-white">{profile.name}</h2>
              <p className="text-sm text-blue-200 dark:text-blue-300">Membro</p>
            </div>
          </div>
        </header>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <Link
                to="/"
                className="flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                onClick={onClose}
              >
                <LayoutDashboard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-zinc-900 dark:text-zinc-100">
                  Dashboard
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/workout"
                className="flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                onClick={onClose}
              >
                <Dumbbell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-zinc-900 dark:text-zinc-100">
                  Meus Treinos
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/workout/new"
                className="flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                onClick={onClose}
              >
                <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-zinc-900 dark:text-zinc-100">
                  Cadastrar Treino
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/workout/history"
                className="flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                onClick={onClose}
              >
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-zinc-900 dark:text-zinc-100">
                  Histórico de Treinos
                </span>
              </Link>
            </li>

            <div className="h-px bg-zinc-200 dark:bg-zinc-700 my-4" />

            <li>
              <Link
                to="/profile"
                className="flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                onClick={onClose}
              >
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-zinc-900 dark:text-zinc-100">
                  Meu Perfil
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/community"
                className="flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                onClick={onClose}
              >
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-zinc-900 dark:text-zinc-100">
                  Comunidade
                </span>
              </Link>
            </li>

            <div className="h-px bg-zinc-200 dark:bg-zinc-700 my-4" />

            <li>
              <button
                className="flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded-lg transition-colors w-full text-left"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-zinc-900 dark:text-zinc-100">Sair</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
