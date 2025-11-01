"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode,
  className?: string,
}
export const NavLink = ({ href, children, className }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={`${isActive ? "bg-red-500 text-white border-r-5 border-red-900" : "text-black"} ${className ?? ""}`}>
      {children}
    </Link>
  );
};
