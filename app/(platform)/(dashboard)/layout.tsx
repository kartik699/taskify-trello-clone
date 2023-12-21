import Navbar from "./_components/navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full overflow-hidden">
            <Navbar />
            {children}
        </div>
    );
}
