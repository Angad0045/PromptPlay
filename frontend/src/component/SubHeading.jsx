import { cn } from "../libs/utils";

export const SubHeading = ({ children, className, as = "p" }) => {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "text-base md:text-xl font-normal tracking-tight",
        className,
      )}
    >
      {children}
    </Tag>
  );
};
