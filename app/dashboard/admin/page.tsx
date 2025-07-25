import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import data from "../data.json";
import AuthGuard from "@/components/AuthGuard";

export default function AdminDashboardPage() {
  return (
    <AuthGuard requireAuth requireAdmin>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive titre="Croissance des utilisateurs" />
          </div>
          <DataTable data={data as any} />
        </div>
      </div>
    </AuthGuard>
  );
}
