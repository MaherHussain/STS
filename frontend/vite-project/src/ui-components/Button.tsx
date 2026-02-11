import { type ReactNode } from "react";

type AddButtonProps = {
  label: string;
  onClick: () => void;
  children?: ReactNode;
};

export default function Button({ onClick ,label, children}: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        cursor-pointer
        flex items-center gap-2
        rounded-lg bg-indigo-600 px-4 py-2
        text-sm font-semibold text-white
        hover:bg-indigo-700
        transition
      "
    >
      {children}
      
      <span>{label}</span>
    </button>
  );
}