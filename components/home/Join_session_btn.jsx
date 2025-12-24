// components/StartLearningButton.tsx
"use client";
export default function JoinButton({
  label = "Join Now",
  onClick = () =>{},
}) {
  return (
    <button
      onClick={onClick}
      className="
        bg-[#1C7262]
        text-white
        px-6
        py-2.5
        rounded-full
        font-medium
        cursor-pointer
        transition
        duration-200
        hover:bg-[#1b6d5e]
        active:scale-95
      "
    >
      {label}
    </button>
  );
}
