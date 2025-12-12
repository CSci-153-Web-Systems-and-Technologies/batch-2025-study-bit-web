import { Sidebar } from "@/components/layout/Sidebar";
import { createServerClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/sign-in");
    }

    return <Sidebar>{children}</Sidebar>;
}
