"use client"

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ban, CheckCircle, MoreHorizontal, Search, UserPlus } from "lucide-react";
import { getUsers, updateUser } from "@/lib/api/admin";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  status: z.string(),
  joinDate: z.string(),
  lastLogin: z.string(),
  role: z.string(),
});

type User = z.infer<typeof userSchema>;

type Column = {
  accessorKey?: keyof User;
  header: string;
  id?: string;
  cell?: (props: { row: { original: User }; handleUserAction?: (userId: number, action: string) => void }) => React.ReactNode;
  enableSorting?: boolean;
  enableHiding?: boolean;
};

const columns: Column[] = [
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.email,
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "active" ? "default" : "destructive"}>
        {row.original.status === "active" ? "Actif" : "Suspendu"}
      </Badge>
    ),
  },
  {
    accessorKey: "joinDate",
    header: "Date d'inscription",
    cell: ({ row }) => row.original.joinDate,
  },
  {
    accessorKey: "lastLogin",
    header: "Dernière connexion",
    cell: ({ row }) => row.original.lastLogin,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, handleUserAction }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {user.status === "active" ? (
              <DropdownMenuItem
                onClick={() => handleUserAction && handleUserAction(user.id, "suspend")}
                className="text-red-600"
              >
                <Ban className="mr-2 h-4 w-4" />
                Suspendre
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => handleUserAction && handleUserAction(user.id, "activate")}
                className="text-green-600"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Activer
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

function UserDataTable({ data, columns, handleUserAction }: { data: User[]; columns: Column[]; handleUserAction: (userId: number, action: string) => void }) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-card text-card-foreground shadow-sm">
      <Table className="min-w-full divide-y divide-border">
        <TableHeader className="bg-muted">
        <TableRow>
          {columns.map((col) => (
              <TableHead key={col.id || (col.accessorKey as string)} className="px-4 py-3 text-left font-semibold text-sm border-b border-border uppercase tracking-wider bg-muted">
                {col.header}
              </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((user) => (
            <TableRow key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
            {columns.map((col) => (
                <TableCell key={col.id || (col.accessorKey as string)} className="px-4 py-2 align-middle text-sm">
                {col.cell
                  ? col.cell({ row: { original: user }, handleUserAction })
                  : col.accessorKey
                  ? (user as any)[col.accessorKey]
                  : null}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );
}

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<any>({ name: '', email: '', role: '', status: '' });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('investeasy-token') || '';
        const data = await getUsers({ search: searchTerm, page }, token);
        setUsers(
          (data.users || []).map((u: any) => ({
            id: Number(u.id),
            name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
            email: u.email,
            status: u.isActive ? "active" : "suspended",
            joinDate: u.createdAt ? u.createdAt.split('T')[0] : '',
            lastLogin: u.lastLogin ? u.lastLogin.split('T')[0] : '',
            role: u.role,
          }))
        );
        setPagination(data.pagination || null);
      } catch (err: any) {
        toast.error(err.message || 'Erreur lors du chargement des utilisateurs');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [searchTerm, page]);

  useEffect(() => {
    if (editUser) {
      setEditForm({
        name: editUser.name,
        email: editUser.email,
        role: editUser.role || '',
        status: editUser.status,
      });
    } else {
      setEditForm({ name: '', email: '', role: '', status: '' });
    }
  }, [editUser]);

  const handleUserAction = async (userId: number, action: string) => {
    setActionLoading(userId);
    try {
      const token = localStorage.getItem('investeasy-token') || '';
      const user = users.find((u) => u.id === userId);
      if (!user) return;
      if (action === "suspend") {
        await updateUser(String(userId), { isActive: false }, token);
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: "suspended" } : u));
        toast.success("Utilisateur suspendu");
      } else if (action === "activate") {
        await updateUser(String(userId), { isActive: true }, token);
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: "active" } : u));
        toast.success("Utilisateur activé");
      } else if (action === "edit") {
        setEditUser(user);
      } else if (action === "delete") {
        setDeleteId(userId);
      }
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la modification');
    } finally {
      setActionLoading(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setActionLoading(deleteId);
    try {
      const token = localStorage.getItem('investeasy-token') || '';
      await updateUser(String(deleteId), { isActive: false }, token); // ou deleteUser si suppression définitive
      setUsers((prev) => prev.filter((u) => u.id !== deleteId));
      toast.success("Utilisateur supprimé");
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la suppression');
    } finally {
      setActionLoading(null);
      setDeleteId(null);
    }
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name || !editForm.email || !editForm.role) {
      toast.error('Tous les champs sont requis');
      return;
    }
    setEditLoading(true);
    try {
      const token = localStorage.getItem('investeasy-token') || '';
      const [firstName, ...lastArr] = editForm.name.split(' ');
      const lastName = lastArr.join(' ');
      await updateUser(String(editUser?.id), {
        firstName,
        lastName,
        role: editForm.role,
        isActive: editForm.status === 'active',
      }, token);
      toast.success('Utilisateur modifié');
      setEditUser(null);
      setEditForm({ name: '', email: '', role: '', status: '' });
      // Rafraîchir la liste
      const data = await getUsers({ search: searchTerm, page }, token);
      setUsers(
        (data.users || []).map((u: any) => ({
          id: Number(u.id),
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
          email: u.email,
          status: u.isActive ? "active" : "suspended",
          joinDate: u.createdAt ? u.createdAt.split('T')[0] : '',
          lastLogin: u.lastLogin ? u.lastLogin.split('T')[0] : '',
          role: u.role,
        }))
      );
      setPagination(data.pagination || null);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la modification');
    } finally {
      setEditLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-background text-foreground px-4 lg:px-6 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-card-foreground">Gestion des utilisateurs</h2>
              <p className="text-muted-foreground mt-2">Gérez les comptes utilisateurs de votre plateforme</p>
            </div>
            <Button className="flex items-center gap-2 self-start md:self-auto">
              <UserPlus className="h-4 w-4" />
              Ajouter un utilisateur
            </Button>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Input
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <Button variant="outline" size="icon" onClick={() => setSearchTerm("")}> <Search className="h-4 w-4" /> </Button>
          </div>
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <>
            <UserDataTable data={filteredUsers} columns={columns} handleUserAction={handleUserAction} />
              {/* Pagination */}
              {pagination && (
                <div className="flex justify-center items-center gap-4 mt-4">
                  <button
                    className="px-4 py-2 rounded-md border disabled:opacity-50"
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                  >
                    Précédent
                  </button>
                  <span>Page {pagination.currentPage} / {pagination.totalPages}</span>
                  <button
                    className="px-4 py-2 rounded-md border disabled:opacity-50"
                    onClick={() => setPage(page + 1)}
                    disabled={!pagination.hasNext}
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          )}
          {/* Confirmation suppression */}
          <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmer la suppression</DialogTitle>
              </DialogHeader>
              <div>Voulez-vous vraiment supprimer cet utilisateur ?</div>
              <div className="flex gap-2 mt-4">
                <Button variant="destructive" onClick={confirmDelete} disabled={actionLoading === deleteId}>Supprimer</Button>
                <Button variant="outline" onClick={() => setDeleteId(null)} disabled={actionLoading === deleteId}>Annuler</Button>
              </div>
            </DialogContent>
          </Dialog>
          {/* Modal d'édition utilisateur */}
          <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier l'utilisateur</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditFormSubmit} className="space-y-4">
                <Input name="name" placeholder="Nom complet" value={editForm.name} onChange={handleEditFormChange} required />
                <Input name="email" placeholder="Email" value={editForm.email} onChange={handleEditFormChange} required type="email" />
                <select name="role" value={editForm.role} onChange={handleEditFormChange} className="w-full border rounded-md px-3 py-2" required>
                  <option value="">Rôle</option>
                  <option value="user">Utilisateur</option>
                  <option value="admin">Admin</option>
                </select>
                <select name="status" value={editForm.status} onChange={handleEditFormChange} className="w-full border rounded-md px-3 py-2" required>
                  <option value="active">Actif</option>
                  <option value="suspended">Suspendu</option>
                </select>
                <div className="flex gap-2 mt-4">
                  <Button type="submit" disabled={editLoading}>{editLoading ? 'Enregistrement...' : 'Valider'}</Button>
                  <Button type="button" variant="outline" onClick={() => setEditUser(null)} disabled={editLoading}>Annuler</Button>
          </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
