import { useAuth, useClerk } from "@clerk/clerk-react";
import axios from "axios";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export interface UserProfile {
  id?: string;
  name: string;
  avatar: string;
  height?: number;
  weight?: number;
  goal?: string;
  experience?: string;
  publicProfile?: boolean;
}

interface UserContextType {
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
  fetchProfile: () => void;
  userProfileLoaded: boolean;
  savingProfile: boolean;
  isAdmin?: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const { user } = useClerk();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    name: "",
    avatar: "",
    height: 0,
    weight: 0,
    goal: "",
    experience: "",
    publicProfile: true,
  });
  const [userProfileLoaded, setUserProfileLoaded] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user?.publicMetadata?.permission === "admin") {
      setIsAdmin(true);
    }
  }, [user]);

  const fetchProfile = async () => {
    const userId = user?.id;
    const name = user?.fullName;
    const avatar = user?.imageUrl;
    axios
      .post(
        "/auth",
        { userId, name, avatar },
        {
          baseURL: import.meta.env.VITE_API_BASE_URL,
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      )
      .then(({ data }) => {
        setProfile(data);
        setUserProfileLoaded(true);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        setUserProfileLoaded(false);
      });
  };

  const updateProfile = async (profile: UserProfile) => {
    setSavingProfile(true);
    axios
      .patch(`/auth/${profile.id}`, profile, {
        baseURL: import.meta.env.VITE_API_BASE_URL,
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      })
      .then(({ data }) => {
        setProfile(data);
        toast.success("Perfil atualizado com sucesso");
      })
      .catch((error) => {
        console.error("Error updating user profile:", error);
        toast.error("Erro ao atualizar o perfil");
      })
      .finally(() => {
        setSavingProfile(false);
      });
  };

  return (
    <UserContext.Provider
      value={{
        profile,
        updateProfile,
        fetchProfile,
        userProfileLoaded,
        savingProfile,
        isAdmin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserProfile = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProvider");
  }
  return context;
};
