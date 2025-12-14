import { Sidebar } from "@/components/layout/Sidebar";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // TODO: Re-enable auth check after fixing Vercel cookie issue
    // const supabase = await createServerClient();
    // const { data: { user } } = await supabase.auth.getUser();
    // if (!user) {
    //     redirect("/sign-in");
    // }

    return <Sidebar>{children}</Sidebar>;
}
