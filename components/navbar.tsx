"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";
import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Package,
  Settings,
  ShoppingCart,
  Sun,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    {
      href: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/products",
      label: "Productos",
      icon: Package,
    },
    {
      href: "/sales",
      label: "Vendas",
      icon: ShoppingCart,
    },
    {
      href: "/reports",
      label: "Relatórios",
      icon: BarChart3,
    },
    {
      href: "/admin/users",
      label: "Utilizadores",
      icon: Users,
    },
  ];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;

        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith("/admin"));

        return (
          <Link
            href={item.href}
            onClick={() => setOpen(false)}
            className={`transition-all duration-200 ${
              mobile
                ? `flex items-center gap-3 rounded-xl text-sm px-4 py-2
                ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-primary hover:text-background"
                }`
                : isActive
                  ? "text-primary font-semibold"
                  : "hover:text-primary hover:font-semibold"
            }`}
          >
            {mobile && <Icon className="h-5 w-5" />}

            <span className={isActive && mobile ? "font-semibold" : ""}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </>
  );

  return (
    <nav className="fixed top-0 z-50 bg-background w-full border-b border-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link href="/">
          <Image
            src="/logo3.png"
            alt="Logo"
            width={150}
            height={100}
            style={{ height: "auto" }}
          />
        </Link>

        {/* DESKTOP */}
        <div className="hidden items-center gap-6 text-sm md:flex">
          {isLoaded && user && <NavLinks />}

          <div className="flex items-center gap-2 pl-4 border-l">
            <Button
              size="icon"
              variant="outline"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-primary" />
              ) : (
                <Moon className="h-4 w-4 text-primary" />
              )}
            </Button>

            {isLoaded && <UserButton />}
          </div>
        </div>

        {/* MOBILE */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            size="icon"
            variant="outline"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {isLoaded && <UserButton />}

          {/* DRAWER */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-72 border-r border-border/50 p-0"
            >
              <div className="flex h-full flex-col bg-background">
                {/* HEADER */}
                <div className="border-b px-6 pl-2">
                  <SheetTitle className="flex items-center gap-2 text-left font-bold">
                    <Link href="/">
                      <Image
                        src="/logo3.png"
                        alt="Logo"
                        width={150}
                        height={100}
                        style={{ height: "auto" }}
                      />
                    </Link>
                  </SheetTitle>

                  <SheetDescription className="sr-only">
                    Menu lateral
                  </SheetDescription>
                </div>

                {/* NAVIGATION */}
                <div className="flex-1 overflow-y-auto px-4 py-6">
                  <div className="flex flex-col gap-2">
                    <NavLinks mobile />
                  </div>

                  {/* ADMIN */}
                  <div className="mt-6 border-t pt-6">
                    <Link
                      href="/admin/users"
                      className="flex items-center gap-3 rounded-xl text-sm px-4 py-2 transition-all hover:bg-primary hover:text-background"
                    >
                      <Settings className="h-5 w-5" />
                      <span>Administração</span>
                    </Link>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="border-t p-4">
                  <Button
                    variant="destructive"
                    onClick={() => signOut()}
                    className="w-full justify-start gap-2 rounded-xl"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
