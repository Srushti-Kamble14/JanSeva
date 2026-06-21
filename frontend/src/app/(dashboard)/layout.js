import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="flex pt-16 min-h-screen overflow-x-hidden">
        <Sidebar />
        <main className="flex-1 min-w-0 md:pl-64 min-h-[calc(100vh-64px)] overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </>
  );
}
