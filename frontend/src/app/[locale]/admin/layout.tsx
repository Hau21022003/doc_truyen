import { AdminGuard } from "@/components/guards/admin-guard";
import { AdminHeader } from "@/components/layout/admin-header";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { SidebarProvider } from "@/providers/sidebar-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <SidebarProvider>
        <div className="flex h-screen">
          <AdminSidebar />
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Header chỉ hiển thị trên di động */}
            <AdminHeader />
            {/* p-4 md:p-6 */}
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </AdminGuard>
  );
}
