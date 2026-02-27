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
    PieChart,
    Pie,
    Cell,
} from "recharts";
import {
    Calendar,
    BookOpen,
    Award,
    CheckCircle,
    Clock,
    TrendingUp,
    AlertCircle,
    Target,
    Star,
} from "lucide-react";

export default function Dashboard() {
    const { props } = usePage();
    const data = props;

    // Chart data
    const todaySchedule = data.chart_data?.today_schedule || [];
    const pendingAssignments = data.chart_data?.pending_assignments || 0;
    const recentGrades = data.chart_data?.recent_grades || [];
    const attendanceStats = data.chart_data?.attendance_stats || {};
    const performanceTrend = data.chart_data?.performance_trend || [];

    const stats = [
        {
            title: "Materi Tersedia",
            value: data.total_materi || 0,
            icon: BookOpen,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
        },
        {
            title: "Tugas Aktif",
            value: data.total_tugas || 0,
            icon: Award,
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-50",
            textColor: "text-green-600",
        },
        {
            title: "Nilai Saya",
            value: data.total_nilai || 0,
            icon: Star,
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50",
            textColor: "text-purple-600",
        },
        {
            title: "Rekomendasi",
            value: data.total_rekomendasi || 0,
            icon: Target,
            color: "from-orange-500 to-orange-600",
            bgColor: "bg-orange-50",
            textColor: "text-orange-600",
        },
    ];

    const attendanceData = [
        {
            name: "Hadir",
            value: attendanceStats.present || 0,
            color: "#10B981",
        },
        { name: "Alpa", value: attendanceStats.absent || 0, color: "#EF4444" },
        { name: "Sakit", value: attendanceStats.sick || 0, color: "#F59E0B" },
        {
            name: "Izin",
            value: attendanceStats.permission || 0,
            color: "#6B7280",
        },
    ];

    return (
        <AppLayout>
            <Head title="Dashboard Siswa" />

            <div className="space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Dashboard Siswa
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Pantau perkembangan belajar dan jadwal harian Anda
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

                {/* Today's Schedule & Pending Assignments */}
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
                                                                        .guru
                                                                        ?.name
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
                                            Tidak ada jadwal pelajaran hari ini
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Pending Assignments Alert */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-orange-500" />
                                    Tugas Belum Dikerjakan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <div className="text-4xl font-bold text-orange-500 mb-2">
                                        {pendingAssignments}
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        Tugas yang belum dikerjakan
                                    </p>
                                    {pendingAssignments > 0 && (
                                        <Badge
                                            variant="outline"
                                            className="text-orange-600 border-orange-600"
                                        >
                                            Perlu Dikerjakan
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Recent Grades & Attendance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Grades */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="w-5 h-5" />
                                    Nilai Terbaru
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {recentGrades.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentGrades.map((grade, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`p-2 rounded-lg ${
                                                            grade.score >= 80
                                                                ? "bg-green-100"
                                                                : grade.score >=
                                                                  60
                                                                ? "bg-yellow-100"
                                                                : "bg-red-100"
                                                        }`}
                                                    >
                                                        <Award
                                                            className={`w-4 h-4 ${
                                                                grade.score >=
                                                                80
                                                                    ? "text-green-600"
                                                                    : grade.score >=
                                                                      60
                                                                    ? "text-yellow-600"
                                                                    : "text-red-600"
                                                            }`}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {grade.assignment}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {grade.date}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className={`text-lg font-bold ${
                                                        grade.score >= 80
                                                            ? "text-green-600"
                                                            : grade.score >= 60
                                                            ? "text-yellow-600"
                                                            : "text-red-600"
                                                    }`}
                                                >
                                                    {grade.score}/100
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>Belum ada nilai yang diberikan</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Attendance Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    Status Absensi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={attendanceData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) =>
                                                percent > 0
                                                    ? `${name} ${(
                                                          percent * 100
                                                      ).toFixed(0)}%`
                                                    : ""
                                            }
                                        >
                                            {attendanceData.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                    />
                                                )
                                            )}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                            {attendanceStats.present || 0}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Hadir
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-red-600">
                                            {attendanceStats.absent || 0}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Alpa
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Performance Trend */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                Tren Performa
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={performanceTrend}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        className="opacity-30"
                                    />
                                    <XAxis
                                        dataKey="date"
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
                                            "Nilai",
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

                {/* Recommendations */}
                {data.rekomendasi && data.rekomendasi.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="w-5 h-5" />
                                    Materi Rekomendasi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {data.rekomendasi.map((rek, index) => (
                                        <div
                                            key={index}
                                            className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500"
                                        >
                                            <h4 className="font-medium text-blue-900 mb-2">
                                                {rek.materi?.judul}
                                            </h4>
                                            <p className="text-sm text-blue-700 mb-3">
                                                {rek.alasan}
                                            </p>
                                            <Badge
                                                variant={
                                                    rek.status === "aktif"
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {rek.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </AppLayout>
    );
}
