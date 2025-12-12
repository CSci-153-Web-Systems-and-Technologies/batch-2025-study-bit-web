"use client";

import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { ChartDataPoint, SubjectDistribution } from '@/lib/reports/types';

interface ReportChartsProps {
    timeline: ChartDataPoint[];
    subjects: SubjectDistribution[];
}

export function ReportCharts({ timeline, subjects }: ReportChartsProps) {
    // Fill empty data if needed to avoid recharts errors
    const safeTimeline = timeline.length > 0 ? timeline : [{ date: new Date().toISOString().split('T')[0], minutes: 0, focus: 0, honesty: 0, sessions: 0 }];
    const safeSubjects = subjects.length > 0 ? subjects : [{ name: 'No Data', minutes: 1, color: '#e2e8f0', percentage: 100 }];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Timeline Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Study Activity</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={safeTimeline} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(str) => {
                                        const d = new Date(str);
                                        return `${d.getMonth() + 1}/${d.getDate()}`;
                                    }}
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => `${val}m`}
                                />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number, _name: string) => [`${value} min`, 'Duration']}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="minutes"
                                    stroke="#06b6d4"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorMinutes)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Subject Distribution */}
                <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Subject Split</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={safeSubjects}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="minutes"
                                    nameKey="name"
                                >
                                    {safeSubjects.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => [`${value} min`, 'Time']} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
