"use client"

import React, { useState } from "react";
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

const mockUsers = [
  {
    id: 1,
    name: "Jean Dupont",
    email: "jean.dupont@email.com",
    status: "active",
    joinDate: "2024-01-15",
    lastLogin: "2024-02-10",
  },
  {
    id: 2,
    name: "Marie Martin",
    email: "marie.martin@email.com",
    status: "active",
    joinDate: "2024-01-20",
    lastLogin: "2024-02-09",
  },
  {
    id: 3,
    name: "Pierre Bernard",
    email: "pierre.bernard@email.com",
    status: "suspended",
    joinDate: "2024-01-10",
    lastLogin: "2024-02-05",
  },
];

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  status: z.string(),
  joinDate: z.string(),
  lastLogin: z.string(),
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
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.id || (col.accessorKey as string)}>{col.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((user) => (
          <TableRow key={user.id}>
            {columns.map((col) => (
              <TableCell key={col.id || (col.accessorKey as string)}>
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
  );
}

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>(mockUsers);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserAction = (userId: number, action: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          if (action === "suspend") return { ...u, status: "suspended" };
          if (action === "activate") return { ...u, status: "active" };
        }
        return u;
      })
    );
  };

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
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="bg-card text-card-foreground border rounded-lg shadow-sm p-4">
            <UserDataTable data={filteredUsers} columns={columns} handleUserAction={handleUserAction} />
          </div>
        </div>
      </div>
    </div>
  );
}
