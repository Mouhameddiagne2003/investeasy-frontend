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
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { getAdminVideos, deleteVideo, updateVideo, createVideo } from "@/lib/api/admin";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
        {data.map((video) => (
            <TableRow key={video.id} className="border-b border-border hover:bg-muted/50 transition-colors">
            {columns.map((col) => (
                <TableCell key={col.id || (col.accessorKey as string)} className="px-4 py-2 align-middle text-sm">
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
    </div>
  );
}

export default function VideoManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editVideo, setEditVideo] = useState<Video | null>(null);
  const [createModal, setCreateModal] = useState(false);
  const [form, setForm] = useState<any>({ title: '', url: '', category: '', duration: '' });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('investeasy-token') || '';
        const data = await getAdminVideos({ search: searchTerm, page }, token);
        setVideos(
          (data.videos || []).map((v: any) => ({
            id: Number(v.id),
            title: v.title,
            category: v.category,
            duration: v.duration ? String(v.duration) : '',
            views: v.views || 0,
            status: v.isPublished ? "published" : "draft",
            publishDate: v.createdAt ? v.createdAt.split('T')[0] : null,
          }))
        );
        setPagination(data.pagination || null);
      } catch (err: any) {
        toast.error(err.message || 'Erreur lors du chargement des vidéos');
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [searchTerm, page]);

  useEffect(() => {
    if (editVideo) {
      setForm({
        title: editVideo.title,
        url: '', // à remplir si tu veux l'édition complète
        category: editVideo.category,
        duration: editVideo.duration,
      });
    } else {
      setForm({ title: '', url: '', category: '', duration: '' });
    }
  }, [editVideo, createModal]);

  const handleVideoAction = async (videoId: number, action: string) => {
    setActionLoading(videoId);
    try {
      const token = localStorage.getItem('investeasy-token') || '';
      const video = videos.find((v) => v.id === videoId);
      if (!video) return;
      if (action === "delete") {
        setDeleteId(videoId);
      } else if (action === "publish") {
        await updateVideo(String(videoId), { isPublished: true }, token);
        setVideos((prev) => prev.map((v) => v.id === videoId ? { ...v, status: "published" } : v));
        toast.success("Vidéo publiée");
      } else if (action === "edit") {
        setEditVideo(video);
      }
      // Pour la suppression, confirmation via modal
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'action');
    } finally {
      setActionLoading(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setActionLoading(deleteId);
    try {
      const token = localStorage.getItem('investeasy-token') || '';
      await deleteVideo(String(deleteId), token);
      setVideos((prev) => prev.filter((v) => v.id !== deleteId));
      toast.success("Vidéo supprimée");
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la suppression');
    } finally {
      setActionLoading(null);
      setDeleteId(null);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.url || !form.category || !form.duration) {
      toast.error('Tous les champs sont requis');
      return;
    }
    setFormLoading(true);
    try {
      const token = localStorage.getItem('investeasy-token') || '';
      if (editVideo) {
        await updateVideo(String(editVideo.id), { ...form, duration: Number(form.duration) }, token);
        toast.success('Vidéo modifiée');
      } else {
        await createVideo({ ...form, duration: Number(form.duration) }, token);
        toast.success('Vidéo créée');
      }
      setCreateModal(false);
      setEditVideo(null);
      setForm({ title: '', url: '', category: '', duration: '' });
      // Rafraîchir la liste
      const data = await getAdminVideos({ search: searchTerm, page }, token);
      setVideos(
        (data.videos || []).map((v: any) => ({
          id: Number(v.id),
          title: v.title,
          category: v.category,
          duration: v.duration ? String(v.duration) : '',
          views: v.views || 0,
          status: v.isPublished ? "published" : "draft",
          publishDate: v.createdAt ? v.createdAt.split('T')[0] : null,
        }))
      );
      setPagination(data.pagination || null);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la soumission');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-background text-foreground px-4 lg:px-6 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-card-foreground">Gestion des vidéos</h2>
              <p className="text-muted-foreground mt-2">Gérez les vidéos de la plateforme</p>
            </div>
            <Button className="flex items-center gap-2 self-start md:self-auto" onClick={() => setCreateModal(true)}>
              <Plus className="h-4 w-4" />
              Ajouter une vidéo
            </Button>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Input
              placeholder="Rechercher par titre ou catégorie..."
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
            <VideoDataTable data={filteredVideos} columns={columns} handleVideoAction={handleVideoAction} />
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
              <div>Voulez-vous vraiment supprimer cette vidéo ?</div>
              <div className="flex gap-2 mt-4">
                <Button variant="destructive" onClick={confirmDelete} disabled={actionLoading === deleteId}>Supprimer</Button>
                <Button variant="outline" onClick={() => setDeleteId(null)} disabled={actionLoading === deleteId}>Annuler</Button>
              </div>
            </DialogContent>
          </Dialog>
          {/* Modal création/édition */}
          <Dialog open={createModal || !!editVideo} onOpenChange={() => { setCreateModal(false); setEditVideo(null); }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editVideo ? 'Modifier la vidéo' : 'Ajouter une vidéo'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <Input name="title" placeholder="Titre" value={form.title} onChange={handleFormChange} required />
                <Input name="url" placeholder="URL de la vidéo" value={form.url} onChange={handleFormChange} required />
                <Input name="category" placeholder="Catégorie" value={form.category} onChange={handleFormChange} required />
                <Input name="duration" placeholder="Durée (en minutes)" value={form.duration} onChange={handleFormChange} required type="number" min={1} />
                <div className="flex gap-2 mt-4">
                  <Button type="submit" disabled={formLoading}>{formLoading ? 'Enregistrement...' : 'Valider'}</Button>
                  <Button type="button" variant="outline" onClick={() => { setCreateModal(false); setEditVideo(null); }} disabled={formLoading}>Annuler</Button>
          </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
