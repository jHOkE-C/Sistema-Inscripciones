import type { ReactNode } from "react";


export function ErrorCheckboxRow({children}: {children:ReactNode}) {
  return (
    <div className="flex items-center justify-between text-sm mb-2 transition-all duration-200 text-red-500">
      <div className="error-text border-1 p-2 rounded-md">{children}</div>
      <input
        type="checkbox"
        className="h-4 w-4 cursor-pointer ml-2"
        onChange={(e) => {
          const parentDiv = e.currentTarget.closest("div");
          const textElement = parentDiv?.querySelector(".error-text");
          if (e.currentTarget.checked) {
            parentDiv?.classList.remove("text-red-500");
            parentDiv?.classList.add("text-zinc-400");
            textElement?.classList.add("line-through");
          } else {
            parentDiv?.classList.remove("text-zinc-400");
            parentDiv?.classList.add("text-red-500");
            textElement?.classList.remove("line-through");
          }
        }}
      />
    </div>
  );
}
