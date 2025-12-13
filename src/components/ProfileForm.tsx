"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Clock, Target, Save, Loader2, ImageIcon, Camera } from "lucide-react";
import { updateProfile } from "@/app/actions/profile";
import type { Database } from "@/types/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ProfileFormProps {
    profile: Profile | null;
    email: string;
}

export function ProfileForm({ profile, email }: ProfileFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [fullName, setFullName] = useState(profile?.full_name || "");
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
    const [coverUrl, setCoverUrl] = useState((profile as Record<string, unknown>)?.cover_url as string || "");
    const [dailyGoal, setDailyGoal] = useState(profile?.daily_goal_minutes || 120);
    const [sessionDuration, setSessionDuration] = useState(profile?.preferred_session_duration || 25);
    const [timezone, setTimezone] = useState(profile?.timezone || "UTC");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await updateProfile({
                fullName,
                avatarUrl: avatarUrl || undefined,
                coverUrl: coverUrl || undefined,
                dailyGoalMinutes: dailyGoal,
                preferredSessionDuration: sessionDuration,
                timezone
            });

            if (result.success) {
                setSuccess(true);
                router.refresh();
                setTimeout(() => setSuccess(false), 3000);
            } else {
                setError(result.error || "Failed to update profile");
            }
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">Profile Settings</h3>
                <p className="text-sm text-neutral-500">Update your personal information and preferences</p>
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                    Profile updated successfully!
                </div>
            )}

            {/* Photo URLs Section */}
            <div className="space-y-4 p-4 bg-neutral-50 rounded-xl">
                <h4 className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Profile Photos
                </h4>

                <div className="grid gap-4 sm:grid-cols-2">
                    {/* Avatar URL */}
                    <div className="space-y-2">
                        <label htmlFor="avatarUrl" className="block text-sm font-medium text-neutral-700">
                            Avatar Image URL
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input
                                id="avatarUrl"
                                type="url"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                placeholder="https://example.com/avatar.jpg"
                                className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-neutral-900 bg-white text-sm"
                            />
                        </div>
                        {avatarUrl && (
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-200">
                                    <img src={avatarUrl} alt="Avatar preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                                </div>
                                <span className="text-xs text-neutral-500">Preview</span>
                            </div>
                        )}
                    </div>

                    {/* Cover URL */}
                    <div className="space-y-2">
                        <label htmlFor="coverUrl" className="block text-sm font-medium text-neutral-700">
                            Cover Image URL
                        </label>
                        <div className="relative">
                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input
                                id="coverUrl"
                                type="url"
                                value={coverUrl}
                                onChange={(e) => setCoverUrl(e.target.value)}
                                placeholder="https://example.com/cover.jpg"
                                className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-neutral-900 bg-white text-sm"
                            />
                        </div>
                        {coverUrl && (
                            <div className="h-12 rounded-lg overflow-hidden bg-neutral-200">
                                <img src={coverUrl} alt="Cover preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                            </div>
                        )}
                    </div>
                </div>
                <p className="text-xs text-neutral-500">
                    Tip: You can use image hosting services like Imgur, Cloudinary, or any direct image URL.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                {/* Full Name */}
                <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700">
                        Full Name
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Your name"
                            className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-neutral-900"
                        />
                    </div>
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-700">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg bg-neutral-50 text-neutral-500 cursor-not-allowed"
                    />
                </div>

                {/* Daily Goal */}
                <div className="space-y-2">
                    <label htmlFor="dailyGoal" className="block text-sm font-medium text-neutral-700">
                        Daily Study Goal (minutes)
                    </label>
                    <div className="relative">
                        <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                            id="dailyGoal"
                            type="number"
                            min={15}
                            max={480}
                            value={dailyGoal}
                            onChange={(e) => setDailyGoal(Number(e.target.value))}
                            className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-neutral-900"
                        />
                    </div>
                    <p className="text-xs text-neutral-500">{Math.floor(dailyGoal / 60)}h {dailyGoal % 60}m per day</p>
                </div>

                {/* Preferred Session Duration */}
                <div className="space-y-2">
                    <label htmlFor="sessionDuration" className="block text-sm font-medium text-neutral-700">
                        Preferred Session Length (minutes)
                    </label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <select
                            id="sessionDuration"
                            value={sessionDuration}
                            onChange={(e) => setSessionDuration(Number(e.target.value))}
                            className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-neutral-900 bg-white appearance-none"
                        >
                            <option value={15}>15 minutes</option>
                            <option value={25}>25 minutes (Pomodoro)</option>
                            <option value={30}>30 minutes</option>
                            <option value={45}>45 minutes</option>
                            <option value={60}>60 minutes</option>
                            <option value={90}>90 minutes</option>
                        </select>
                    </div>
                </div>

                {/* Timezone */}
                <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="timezone" className="block text-sm font-medium text-neutral-700">
                        Timezone
                    </label>
                    <select
                        id="timezone"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-neutral-900 bg-white"
                    >
                        <option value="UTC">UTC</option>
                        <option value="Asia/Manila">Asia/Manila (PHT)</option>
                        <option value="America/New_York">America/New York (EST)</option>
                        <option value="America/Los_Angeles">America/Los Angeles (PST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                        <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-neutral-100">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    Save Changes
                </button>
            </div>
        </form>
    );
}
