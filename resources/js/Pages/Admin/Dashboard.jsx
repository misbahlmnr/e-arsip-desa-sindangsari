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
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import {
    Users,
    GraduationCap,
    BookOpen,
    UserCheck,
    TrendingUp,
    Activity,
    Calendar,
    Award,
} from "lucide-react";

export default function Dashboard() {
    const { props } = usePage();
    const data = props;

    // Chart data
    const userGrowthData = data.chart_data?.user_growth || [];
    const classDistributionData = data.chart_data?.class_distribution || [];
    const subjectPerformanceData = data.chart_data?.subject_performance || [];
    const recentActivity = data.chart_data?.recent_activity || {};

    const stats = [
        {
            title: "Total Users",
            value: data.total_users || 0,
            icon: Users,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
        },
        {
            title: "Total Kelas",
            value: data.total_kelas || 0,
            icon: GraduationCap,
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-50",
            textColor: "text-green-600",
        },
        {
            title: "Total Guru",
            value: data.total_guru || 0,
            icon: UserCheck,
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50",
            textColor: "text-purple-600",
        },
        {
            title: "Total Siswa",
            value: data.total_siswa || 0,
            icon: BookOpen,
            color: "from-orange-500 to-orange-600",
            bgColor: "bg-orange-50",
            textColor: "text-orange-600",
        },
    ];

    const activityStats = [
        {
            title: "Materi Dibuat",
            value: recentActivity.materi_created || 0,
            icon: BookOpen,
            period: "7 hari terakhir",
        },
        {
            title: "Tugas Dibuat",
            value: recentActivity.tugas_created || 0,
            icon: Award,
            period: "7 hari terakhir",
        },
        {
            title: "Absensi Dicatat",
            value: recentActivity.absensi_taken || 0,
            icon: Calendar,
            period: "7 hari terakhir",
        },
        {
            title: "Nilai Diberikan",
            value: recentActivity.nilai_given || 0,
            icon: TrendingUp,
            period: "7 hari terakhir",
        },
    ];

    return (
        <AppLayout>
            <Head title="Dashboard Admin" />

            <div className="space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Dashboard Admin
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Ringkasan sistem dan aktivitas terbaru
                        </p>
                    </div>
                    <Badge variant="secondary" className="px-3 py-1">
                        <Activity className="w-4 h-4 mr-2" />
                        Live Data
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

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5" />
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

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Growth */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Pertumbuhan User (30 Hari)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={userGrowthData}>
                                        <defs>
                                            <linearGradient
                                                id="colorUsers"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#3B82F6"
                                                    stopOpacity={0.3}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#3B82F6"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
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
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "white",
                                                border: "1px solid #e5e7eb",
                                                borderRadius: "8px",
                                                boxShadow:
                                                    "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="users"
                                            stroke="#3B82F6"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorUsers)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Class Distribution */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <GraduationCap className="w-5 h-5" />
                                    Distribusi Kelas
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={classDistributionData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            className="opacity-30"
                                        />
                                        <XAxis
                                            dataKey="grade"
                                            axisLine={false}
                                            tickLine={false}
                                            className="text-sm"
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            className="text-sm"
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "white",
                                                border: "1px solid #e5e7eb",
                                                borderRadius: "8px",
                                                boxShadow:
                                                    "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                            }}
                                        />
                                        <Bar
                                            dataKey="count"
                                            fill="#10B981"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Subject Performance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="w-5 h-5" />
                                Performa Mata Pelajaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={subjectPerformanceData}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        className="opacity-30"
                                    />
                                    <XAxis
                                        dataKey="subject"
                                        axisLine={false}
                                        tickLine={false}
                                        className="text-sm"
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
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
