"use client";

import { AuthGuard } from "@/components/auth-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminUsersSkeleton } from "@/components/users/admin-users-skeleton";
import { CheckCircle2, Loader2, Plus, Trash2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
  id: number;
  clerk_id: string;
  name: string;
  email: string;
  role: "admin" | "event_manager" | "sales_person";
  status: "active" | "pending" | "disabled";
  created_at: string;
}

function AdminUsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "sales_person" as "admin" | "event_manager" | "sales_person",
  });
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        router.push("/sign-in");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      // Clerk does not support creating users from the frontend directly.
      // We call our API route which should use the Clerk Backend SDK server-side.
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // No Authorization header needed — Clerk session cookie is sent automatically
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error("Erro ao criar utilizador", {
          description: data?.error || "Falha no servidor",
        });
        return;
      }

      toast.success("Utilizador criado com sucesso", {
        description: data.email,
      });

      setFormData({ name: "", email: "", role: "sales_person" });
      setIsCreating(false);
      await fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Erro inesperado", {
        description: "Não foi possível criar o utilizador",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm("Tem a certeza que quer deletar este utilizador?")) return;

    try {
      // Fix: pass id as query param to match the API route
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: "DELETE",
        // No Authorization header needed — Clerk session cookie is sent automatically
      });

      if (response.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        toast.success("Utilizador eliminado");
      } else {
        const data = await response.json().catch(() => ({}));
        toast.error("Erro ao deletar utilizador", {
          description: data?.error || "Falha no servidor",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Erro ao deletar utilizador");
    }
  };

  if (loading) return <AdminUsersSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestão de Utilizadores
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Criar, editar e gerenciar utilizadores do sistema
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Utilizador
        </Button>
      </div>

      {isCreating && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Criar Novo Utilizador</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome</label>
                  <Input
                    placeholder="João Silva"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="joao@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="event_manager">
                        Gestor de Eventos
                      </SelectItem>
                      <SelectItem value="sales_person">Vendedor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                O utilizador receberá um convite por email para definir a sua
                password via Clerk.
              </p>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreating(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    "Criar Utilizador"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {users.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhum utilizador encontrado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {user.role === "admin"
                            ? "Admin"
                            : user.role === "event_manager"
                              ? "Gestor"
                              : "Vendedor"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {user.status === "active" ? (
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-sm">Ativo</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                            <XCircle className="w-4 h-4" />
                            <span className="text-sm">Inativo</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString("pt-PT")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(user.id)}
                          className="border-destructive/50 hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <AuthGuard requiredRole="admin">
      <AdminUsersContent />
    </AuthGuard>
  );
}
