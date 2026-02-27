import AppLayout from "@/Layouts/AppLayout";
import { Head, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";
import {
    Calendar,
    BookOpen,
    Award,
    Users,
    Clock,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    GraduationCap,
} from "lucide-react";

export default function Dashboard() {
    const { props } = usePage();
    const data = props;

    // Chart data
    const todaySchedule = data.chart_data?.today_schedule || [];
    const classPerformanceData = data.chart_data?.class_performance || [];
    const recentActivities = data.chart_data?.recent_activities || {};
    const unratedAssignments = data.chart_data?.unrated_assignments || 0;

    const stats = [
        {
            title: "Kelas Mengajar",
            value: data.total_kelas || 0,
            icon: GraduationCap,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
        },
        {
            title: "Total Materi",
            value: data.total_materi || 0,
            icon: BookOpen,
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-50",
            textColor: "text-green-600",
        },
        {
            title: "Total Tugas",
            value: data.total_tugas || 0,
            icon: Award,
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50",
            textColor: "text-purple-600",
        },
        {
            title: "Total Siswa",
            value: data.total_siswa || 0,
            icon: Users,
            color: "from-orange-500 to-orange-600",
            bgColor: "bg-orange-50",
            textColor: "text-orange-600",
        },
    ];

    const activityStats = [
        {
            title: "Materi Dibuat",
            value: recentActivities.materi_created || 0,
            icon: BookOpen,
            period: "7 hari terakhir",
        },
        {
            title: "Tugas Dibuat",
            value: recentActivities.tugas_created || 0,
            icon: Award,
            period: "7 hari terakhir",
        },
        {
            title: "Absensi Dicatat",
            value: recentActivities.absensi_taken || 0,
            icon: CheckCircle,
            period: "7 hari terakhir",
        },
        {
            title: "Nilai Diberikan",
            value: recentActivities.nilai_given || 0,
            icon: TrendingUp,
            period: "7 hari terakhir",
        },
    ];

    return (
        <AppLayout>
            <Head title="Dashboard Guru" />

            <div className="space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Dashboard Guru
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Ringkasan pengajaran dan aktivitas hari ini
                        </p>
                    </div>
                    <Badge variant="secondary" className="px-3 py-1">
                        <Clock className="w-4 h-4 mr-2" />
                        {new Date().toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </Badge>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {stats.map((stat, index) => (
                        <Card key={index} className="relative overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        {stat.title}
                                    </CardTitle>
                                    <div
                                        className={`p-2 rounded-lg ${stat.bgColor}`}
                                    >
                                        <stat.icon
                                            className={`w-5 h-5 ${stat.textColor}`}
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                    {stat.value.toLocaleString()}
                                </div>
                                <div
                                    className={`h-1 bg-gradient-to-r ${stat.color} rounded-full`}
                                />
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>

                {/* Today's Schedule & Unrated Assignments */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Today's Schedule */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Jadwal Hari Ini
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {todaySchedule.length > 0 ? (
                                    <div className="space-y-3">
                                        {todaySchedule.map(
                                            (schedule, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-blue-100 rounded-lg">
                                                            <Clock className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">
                                                                {
                                                                    schedule
                                                                        .mapel
                                                                        ?.nama
                                                                }
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {
                                                                    schedule
                                                                        .kelas
                                                                        ?.nama
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-700">
                                                        {schedule.jam_mulai} -{" "}
                                                        {schedule.jam_selesai}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>
                                            Tidak ada jadwal mengajar hari ini
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Unrated Assignments Alert */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-orange-500" />
                                    Tugas Belum Dinilai
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <div className="text-4xl font-bold text-orange-500 mb-2">
                                        {unratedAssignments}
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        Tugas yang belum diberi nilai
                                    </p>
                                    {unratedAssignments > 0 && (
                                        <Badge
                                            variant="outline"
                                            className="text-orange-600 border-orange-600"
                                        >
                                            Perlu Perhatian
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                Aktivitas 7 Hari Terakhir
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {activityStats.map((activity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div className="p-2 bg-white rounded-lg mr-3">
                                            <activity.icon className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {activity.value}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {activity.title}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {activity.period}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Class Performance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="w-5 h-5" />
                                Performa Kelas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={classPerformanceData}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        className="opacity-30"
                                    />
                                    <XAxis
                                        dataKey="class"
                                        axisLine={false}
                                        tickLine={false}
                                        className="text-sm"
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        className="text-sm"
                                        domain={[0, 100]}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "white",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "8px",
                                            boxShadow:
                                                "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                        }}
                                        formatter={(value) => [
                                            `${value}/100`,
                                            "Rata-rata Nilai",
                                        ]}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#8B5CF6"
                                        strokeWidth={3}
                                        dot={{
                                            fill: "#8B5CF6",
                                            strokeWidth: 2,
                                            r: 6,
                                        }}
                                        activeDot={{
                                            r: 8,
                                            stroke: "#8B5CF6",
                                            strokeWidth: 2,
                                        }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AppLayout>
    );
}
