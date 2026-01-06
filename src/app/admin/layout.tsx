import AdminSidebar from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="flex h-[calc(100vh- 64px)]">
        <AdminSidebar />
        <div className="flex-1 px-4 py-10">{children}</div>
      </section>
    </>
  );
}
