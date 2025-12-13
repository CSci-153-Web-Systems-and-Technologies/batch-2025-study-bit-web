import { Sidebar } from "@/components/layout/Sidebar";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <Sidebar>{children}</Sidebar>;
}

