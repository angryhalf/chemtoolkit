import { Sidebar } from '@/components/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 overflow-auto bg-slate-50">
                {children}
            </main>
        </div>
    );
}