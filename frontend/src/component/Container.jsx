import { cn } from "../libs/utils";

export const Container = ({ children, className }) => {
  return (
    <div
      className={cn("w-full lg:max-w-6xl mx-auto flex items-center", className)}
    >
      {children}
    </div>
  );
};
