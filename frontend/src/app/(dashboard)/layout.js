import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="flex pt-16 min-h-screen">
        <Sidebar />
        <main className="flex-1 md:pl-64 min-h-[calc(100vh-64px)] overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </>
  );
}
