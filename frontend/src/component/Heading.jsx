import { cn } from "../libs/utils";

export const Heading = ({ children, className, as = "h2" }) => {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "text-2xl md:text-4xl font-black tracking-tight",
        className,
      )}
    >
      {children}
    </Tag>
  );
};
