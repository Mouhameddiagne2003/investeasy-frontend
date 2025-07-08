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
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";

const mockVideos = [
  {
    id: 1,
    title: "Introduction aux actions",
    category: "Débutant",
    duration: "12:34",
    views: 1234,
    status: "published",
    publishDate: "2024-01-15",
  },
  {
    id: 2,
    title: "Comprendre les ETF",
    category: "Intermédiaire",
    duration: "18:45",
    views: 987,
    status: "published",
    publishDate: "2024-01-20",
  },
  {
    id: 3,
    title: "Gestion des risques",
    category: "Avancé",
    duration: "25:12",
    views: 756,
    status: "draft",
    publishDate: null,
  },
];

const videoSchema = z.object({
  id: z.number(),
  title: z.string(),
  category: z.string(),
  duration: z.string(),
  views: z.number(),
  status: z.string(),
  publishDate: z.string().nullable(),
});

type Video = z.infer<typeof videoSchema>;

type Column = {
  accessorKey?: keyof Video;
  header: string;
  id?: string;
  cell?: (props: { row: { original: Video }; handleVideoAction?: (videoId: number, action: string) => void }) => React.ReactNode;
  enableSorting?: boolean;
  enableHiding?: boolean;
};

const columns: Column[] = [
  {
    accessorKey: "title",
    header: "Titre",
    cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
  },
  {
    accessorKey: "category",
    header: "Catégorie",
    cell: ({ row }) => row.original.category,
  },
  {
    accessorKey: "duration",
    header: "Durée",
    cell: ({ row }) => row.original.duration,
  },
  {
    accessorKey: "views",
    header: "Vues",
    cell: ({ row }) => row.original.views.toLocaleString(),
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "published" ? "default" : "secondary"}>
        {row.original.status === "published" ? "Publié" : "Brouillon"}
      </Badge>
    ),
  },
  {
    accessorKey: "publishDate",
    header: "Date de publication",
    cell: ({ row }) => row.original.publishDate || "Non publié",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, handleVideoAction }) => {
      const video = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              Voir
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            {video.status === "draft" && (
              <DropdownMenuItem onClick={() => handleVideoAction && handleVideoAction(video.id, "publish")}> 
                <Eye className="mr-2 h-4 w-4" />
                Publier
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => handleVideoAction && handleVideoAction(video.id, "delete")}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

function VideoDataTable({ data, columns, handleVideoAction }: { data: Video[]; columns: Column[]; handleVideoAction: (videoId: number, action: string) => void }) {
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
        {data.map((video) => (
          <TableRow key={video.id}>
            {columns.map((col) => (
              <TableCell key={col.id || (col.accessorKey as string)}>
                {col.cell
                  ? col.cell({ row: { original: video }, handleVideoAction })
                  : col.accessorKey
                  ? (video as any)[col.accessorKey]
                  : null}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function VideoManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [videos, setVideos] = useState<Video[]>(mockVideos);

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVideoAction = (videoId: number, action: string) => {
    if (action === "delete") {
      setVideos((prev) => prev.filter((video) => video.id !== videoId));
    } else if (action === "publish") {
      setVideos((prev) =>
        prev.map((video) => {
          if (video.id === videoId) {
            return {
              ...video,
              status: "published",
              publishDate: new Date().toISOString().split("T")[0],
            };
          }
          return video;
        })
      );
    }
  };

  return (
    <div className="bg-background text-foreground px-4 lg:px-6 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-card-foreground">Gestion des vidéos</h2>
              <p className="text-muted-foreground mt-2">Gérez le contenu vidéo de votre plateforme</p>
            </div>
            <Button className="flex items-center gap-2 self-start md:self-auto">
              <Plus className="h-4 w-4" />
              Ajouter une vidéo
            </Button>
          </div>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par titre ou catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="bg-card text-card-foreground border rounded-lg shadow-sm p-4">
            <VideoDataTable data={filteredVideos} columns={columns} handleVideoAction={handleVideoAction} />
          </div>
        </div>
      </div>
    </div>
  );
}
