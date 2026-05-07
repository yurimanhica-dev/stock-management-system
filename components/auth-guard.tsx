"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: "admin" | "event_manager" | "sales_person";
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  if (requiredRole) {
    const role = user?.publicMetadata?.role as string | undefined;
    if (role !== requiredRole) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">
            Não tem permissão para aceder a esta página.
          </p>
        </div>
      );
    }
  }

  return <>{children}</>;
}
