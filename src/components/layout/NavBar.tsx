"use client";

import MainNavBar from "./MainNavBar";

type NavBarProps = {
  variant?: "default" | "overlay";
};

export default function NavBar({ variant = "default" }: NavBarProps) {
  return <MainNavBar variant={variant} />;
}
