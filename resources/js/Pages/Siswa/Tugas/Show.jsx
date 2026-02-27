import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    FileText,
    Clock,
    CheckCircle,
    AlertCircle,
    Upload,
    Download,
    ExternalLink,
} from "lucide-react";
import { useState } from "react";

export default function Show({ tugas, jawaban, nilai }) {
    const [formData, setFormData] = useState({ file: null, link: "" });
    const [submitted, setSubmitted] = useState(
        jawaban && (jawaban.file_path || jawaban.link)
    );
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        router.post(
            route("siswa.tugas.submit", tugas.id),
            {
                _method: "put",
                forceFormData: true,
                ...formData,
            },
            {
                onSuccess: () => {
                    setSubmitted(true);
                    setLoading(false);
                },
                onError: (err) => {
                    setErrors(err);
                    setLoading(false);
                },
            }
        );
    };

    const getStatusInfo = () => {
        if (submitted) {
            return {
                status: "submitted",
                text: "Sudah Dikumpulkan",
                color: "bg-green-100 text-green-800",
                icon: CheckCircle,
            };
        }

        const now = new Date();
        const deadline = new Date(tugas.deadline);

        if (deadline < now) {
            return {
                status: "late",
                text: "Terlambat",
                color: "bg-red-100 text-red-800",
                icon: AlertCircle,
            };
        }

        return {
            status: "pending",
            text: "Belum Dikumpulkan",
            color: "bg-yellow-100 text-yellow-800",
            icon: Clock,
        };
    };

    const statusInfo = getStatusInfo();
    const StatusIcon = statusInfo.icon;

    const getTipeBadge = (tipe) => {
        const colors = {
            kuis: "bg-blue-100 text-blue-800",
            ujian: "bg-red-100 text-red-800",
            tugas: "bg-purple-100 text-purple-800",
        };
        return (
            <Badge className={colors[tipe] || "bg-gray-100 text-gray-800"}>
                {tipe.charAt(0).toUpperCase() + tipe.slice(1)}
            </Badge>
        );
    };

    return (
        <AppLayout>
            <Head title={`Tugas: ${tugas.judul}`} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route("siswa.tugas.index")}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {tugas.judul}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Detail tugas dan pengumpulan
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Task Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <FileText className="w-5 h-5" />
                                    <span>Informasi Tugas</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">
                                            Mata Pelajaran
                                        </Label>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {tugas.mapel?.nama}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">
                                            Guru
                                        </Label>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {tugas.guru?.name}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">
                                            Tipe Tugas
                                        </Label>
                                        <div className="mt-1">
                                            {getTipeBadge(tugas.tipe)}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">
                                            Deadline
                                        </Label>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {new Date(
                                                tugas.deadline
                                            ).toLocaleDateString("id-ID", {
                                                weekday: "long",
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">
                                        Status Pengumpulan
                                    </Label>
                                    <div className="mt-2 flex items-center space-x-2">
                                        <StatusIcon className="w-5 h-5" />
                                        <Badge className={statusInfo.color}>
                                            {statusInfo.text}
                                        </Badge>
                                    </div>
                                </div>

                                {/* File / Link Soal */}
                                {(tugas.file_path || tugas.link_soal) && (
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">
                                            File/Link Soal
                                        </Label>
                                        <div className="mt-2 space-y-2">
                                            {tugas.file_path && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <a
                                                        href={`/storage/${tugas.file_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Download File Soal
                                                    </a>
                                                </Button>
                                            )}
                                            {tugas.link_soal && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <a
                                                        href={tugas.link_soal}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <ExternalLink className="w-4 h-4 mr-2" />
                                                        Link Soal
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Submission History */}
                        {jawaban && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Riwayat Pengumpulan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">
                                                    {jawaban.file_path
                                                        ? "File Jawaban"
                                                        : "Link Jawaban"}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Dikumpulkan pada{" "}
                                                    {new Date(
                                                        jawaban.submitted_at
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                            {jawaban.file_path && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <a
                                                        href={`/storage/${jawaban.file_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Download
                                                    </a>
                                                </Button>
                                            )}
                                            {jawaban.link && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <a
                                                        href={jawaban.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <ExternalLink className="w-4 h-4 mr-2" />
                                                        Buka Link
                                                    </a>
                                                </Button>
                                            )}
                                        </div>

                                        {nilai && nilai.skor > 0 && (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                <div className="flex items-center space-x-2">
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                    <div>
                                                        <p className="font-medium text-green-800">
                                                            Sudah Dinilai
                                                        </p>
                                                        <p className="text-sm text-green-600">
                                                            Skor: {nilai.skor}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Submit Form */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Upload className="w-5 h-5" />
                                    <span>Kumpulkan Tugas</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {submitted ? (
                                    <div className="text-center py-6">
                                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            Tugas Sudah Dikumpulkan
                                        </h3>
                                        <p className="text-gray-600">
                                            Anda sudah mengumpulkan tugas ini.
                                            Tunggu penilaian dari guru.
                                        </p>
                                    </div>
                                ) : (
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <Label htmlFor="file">
                                                File Jawaban
                                            </Label>
                                            <Input
                                                id="file"
                                                type="file"
                                                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        file: e.target.files[0],
                                                    })
                                                }
                                                className="mt-1"
                                            />
                                            {errors.file && (
                                                <p className="text-sm text-red-600 mt-1">
                                                    {errors.file}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-1">
                                                Format: PDF, DOC, DOCX, PPT,
                                                PPTX, JPG, JPEG, PNG. Max: 10MB
                                            </p>
                                        </div>

                                        <div>
                                            <Label htmlFor="link">
                                                Atau Link Jawaban
                                            </Label>
                                            <Input
                                                id="link"
                                                type="url"
                                                placeholder="https://example.com"
                                                value={formData.link}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        link: e.target.value,
                                                    })
                                                }
                                                className="mt-1"
                                            />
                                            {errors.link && (
                                                <p className="text-sm text-red-600 mt-1">
                                                    {errors.link}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-1">
                                                Masukkan URL jika mengumpulkan
                                                melalui link
                                            </p>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={loading}
                                        >
                                            {loading
                                                ? "Mengumpulkan..."
                                                : "Kumpulkan Tugas"}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>

                        {/* Deadline Warning */}
                        {statusInfo.status === "pending" && (
                            <Card className="border-yellow-200 bg-yellow-50">
                                <CardContent className="p-4">
                                    <div className="flex items-start space-x-3">
                                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-medium text-yellow-800">
                                                Deadline Mendekat
                                            </h4>
                                            <p className="text-sm text-yellow-700 mt-1">
                                                Pastikan tugas dikumpulkan
                                                sebelum deadline untuk
                                                menghindari keterlambatan.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </motion.div>
        </AppLayout>
    );
}
