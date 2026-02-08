import { AdminGuard } from "@/components/guards/admin-guard";
import { AdminSidebar } from "@/components/layout/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </AdminGuard>
  );
}
