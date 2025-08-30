import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { HospitalProvider } from "@/contexts/HospitalContext"
import { HospitalSelector } from "@/components/HospitalSelector"

const DashboardPage = () => {
  return (
    <HospitalProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <header className="h-16 flex items-center justify-between border-b bg-background px-4">
              <div className="flex items-center">
                <SidebarTrigger />
                <h1 className="ml-4 text-xl font-semibold text-foreground">Painel de NPS</h1>
              </div>
              <HospitalSelector />
            </header>
            <main className="flex-1 p-6 bg-background">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </HospitalProvider>
  );
};

export default DashboardPage;