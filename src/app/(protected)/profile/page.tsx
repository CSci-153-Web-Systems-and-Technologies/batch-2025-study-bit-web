import { createServerClient } from "@/lib/supabase";
import { getProfile, getStreak } from "@/lib/db/profile";
import { redirect } from "next/navigation";
import Image from "next/image";
import { User, Mail, Clock, Flame, Calendar, Award } from "lucide-react";
import { ProfileForm } from "@/components/ProfileForm";

export const metadata = {
    title: "Profile",
};

export default async function ProfilePage() {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/sign-in");

    const [profile, streak] = await Promise.all([
        getProfile(),
        getStreak()
    ]);

    const { data: stats } = await supabase
        .from("study_sessions")
        .select("actual_duration_minutes")
        .eq("user_id", user.id)
        .eq("is_completed", true);

    const totalMinutes = stats?.reduce((sum, s) => sum + (s.actual_duration_minutes || 0), 0) || 0;
    const totalHours = Math.floor(totalMinutes / 60);
    const totalSessions = stats?.length || 0;

    const coverUrl = (profile as Record<string, unknown>)?.cover_url as string | null;

    return (
        <div className="min-h-screen bg-neutral-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Profile</h1>
                    <p className="text-neutral-500">Manage your account and preferences</p>
                </div>

                {/* User Info Card */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                    {coverUrl ? (
                        <div className="h-32 relative">
                            <img
                                src={coverUrl}
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-32" />
                    )}
                    <div className="px-6 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
                            <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                                {profile?.avatar_url ? (
                                    <Image
                                        src={profile.avatar_url}
                                        alt="Avatar"
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                                        <User className="w-10 h-10 text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 pb-2">
                                <h2 className="text-xl font-bold text-neutral-900">
                                    {profile?.full_name || "StudyBit User"}
                                </h2>
                                <div className="flex items-center gap-2 text-neutral-500 text-sm">
                                    <Mail className="w-4 h-4" />
                                    {user.email}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <Clock className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-neutral-500">Total Time</span>
                        </div>
                        <div className="text-2xl font-bold text-neutral-900">{totalHours} <span className="text-sm font-normal text-neutral-400">hrs</span></div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-neutral-500">Sessions</span>
                        </div>
                        <div className="text-2xl font-bold text-neutral-900">{totalSessions}</div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                                <Flame className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-neutral-500">Current Streak</span>
                        </div>
                        <div className="text-2xl font-bold text-neutral-900">{streak?.current_streak || 0} <span className="text-sm font-normal text-neutral-400">days</span></div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                                <Award className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-neutral-500">Longest Streak</span>
                        </div>
                        <div className="text-2xl font-bold text-neutral-900">{streak?.longest_streak || 0} <span className="text-sm font-normal text-neutral-400">days</span></div>
                    </div>
                </div>

                {/* Profile Form */}
                <ProfileForm
                    profile={profile}
                    email={user.email || ""}
                />
            </div>
        </div>
    );
}
