import { LucideIcon } from "lucide-react";

interface ButtonProps {
  loading?: boolean;
  text: string;
  icon?: LucideIcon;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "success";
  onClick?: () => void;
  fullWidth?: boolean;
  disabled?: boolean;
  customClass?: string; // Adiciona a propriedade customClass
}

export const Button = ({
  text,
  icon: Icon,
  loading,
  onClick,
  type = "button",
  variant = "primary",
  fullWidth = false,
  disabled,
  customClass = "", // Define um valor padrão para customClass
}: ButtonProps) => {
  const baseClasses = "px-6 py-2 rounded-md transition-all flex items-center gap-2 justify-center";
  const primaryClasses = "bg-blue-600 text-white hover:bg-blue-700";
  const secondaryClasses = "bg-zinc-600 text-white hover:bg-zinc-700";
  const dangerClasses = "bg-red-600 text-white hover:bg-red-700";
  const successClasses = "bg-green-600 text-white hover:bg-green-700";

  const variantClasses =
    variant === "primary"
      ? primaryClasses
      : variant === "secondary"
      ? secondaryClasses
      : variant === "danger"
      ? dangerClasses
      : successClasses;

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${widthClass} ${customClass} ${
        loading || disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading ? (
        <span className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Por favor, Aguarde!
        </span>
      ) : (
        <>
          {Icon && <Icon size={20} />}
          <span>{text}</span>
        </>
      )}
    </button>
  );
};