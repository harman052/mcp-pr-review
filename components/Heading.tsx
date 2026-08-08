import { ElementType, HTMLAttributes } from "react";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3;
}

const headingStyles = {
  1: "mb-2 text-3xl font-bold",
  2: "mb-2 text-2xl font-semibold",
  3: "mb-2 text-xl font-semibold",
} as const;

export function Heading({
  level,
  children,
  className,
  ...props
}: HeadingProps) {
  const Tag: ElementType = `h${level}`;
  return (
    <Tag className={`${headingStyles[level]} ${className ?? ""}`} {...props}>
      {children}
    </Tag>
  );
}
