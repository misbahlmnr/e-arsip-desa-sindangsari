import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
    Download,
    FileText,
    User,
    CheckCircle,
    Clock,
    AlertCircle,
    Save,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

export default function Show({ tugas, nilai }) {
    const [expanded, setExpanded] = useState({});
    const [grading, setGrading] = useState({});

    const toggleExpanded = (id) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleGrade = (nilaiId, skor) => {
        router.post(
            route("guru.tugas.grade", { tuga: tugas.id, nilaiId }),
            {
                skor: parseFloat(skor),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setGrading((prev) => ({ ...prev, [nilaiId]: "" }));
                },
            }
        );
    };

    return (
        <AppLayout>
            <Head title={`Detail Tugas - ${tugas?.judul || "-"}`} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Detail Tugas
                    </h1>
                    <div className="flex space-x-2">
                        {tugas?.id && (
                            <Button variant="outline" asChild>
                                <Link href={route("guru.tugas.edit", tugas.id)}>
                                    Edit
                                </Link>
                            </Button>
                        )}
                        <Button variant="outline" asChild>
                            <Link href={route("guru.tugas.index")}>
                                Kembali
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Data Tugas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Tugas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Judul
                                </label>
                                <p className="text-sm text-gray-900">
                                    {tugas?.judul || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Tipe
                                </label>
                                <p className="text-sm text-gray-900">
                                    {tugas?.tipe || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Mata Pelajaran
                                </label>
                                <p className="text-sm text-gray-900">
                                    {tugas?.mapel?.nama || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Kelas
                                </label>
                                <p className="text-sm text-gray-900">
                                    {tugas?.kelas?.nama || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Deadline
                                </label>
                                <p className="text-sm text-gray-900">
                                    {tugas?.deadline
                                        ? new Date(
                                              tugas.deadline
                                          ).toLocaleString("id-ID")
                                        : "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Dibuat
                                </label>
                                <p className="text-sm text-gray-900">
                                    {tugas?.created_at
                                        ? new Date(
                                              tugas.created_at
                                          ).toLocaleDateString()
                                        : "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Diperbarui
                                </label>
                                <p className="text-sm text-gray-900">
                                    {tugas?.updated_at
                                        ? new Date(
                                              tugas.updated_at
                                          ).toLocaleDateString()
                                        : "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    File Soal
                                </label>
                                <p className="text-sm text-gray-900">
                                    {tugas?.file_path ? (
                                        <a
                                            href={`/storage/${tugas.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Download
                                        </a>
                                    ) : (
                                        "-"
                                    )}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Link Soal
                                </label>
                                <p className="text-sm text-gray-900">
                                    {tugas?.link_soal ? (
                                        <a
                                            href={tugas.link_soal}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {tugas.link_soal}
                                        </a>
                                    ) : (
                                        "-"
                                    )}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Submissions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <FileText className="w-5 h-5" />
                            <span>
                                Pengumpulan Tugas ({nilai?.length || 0})
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {nilai && nilai.length > 0 ? (
                            <div className="space-y-4">
                                {nilai.map((submission) => (
                                    <div
                                        key={submission.id}
                                        className="border border-gray-200 rounded-lg p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <User className="w-5 h-5 text-gray-500" />
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {submission.siswa?.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Dikumpulkan pada{" "}
                                                        {new Date(
                                                            submission.created_at
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
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {submission.skor > 0 ? (
                                                    <Badge className="bg-green-100 text-green-800">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Dinilai:{" "}
                                                        {submission.skor}
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-yellow-100 text-yellow-800">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        Belum Dinilai
                                                    </Badge>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        toggleExpanded(
                                                            submission.id
                                                        )
                                                    }
                                                >
                                                    {expanded[submission.id] ? (
                                                        <ChevronUp className="w-4 h-4 mr-1" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4 mr-1" />
                                                    )}
                                                    Detail
                                                </Button>
                                            </div>
                                        </div>
                                        <AnimatePresence>
                                            {expanded[submission.id] && (
                                                <motion.div
                                                    initial={{
                                                        height: 0,
                                                        opacity: 0,
                                                    }}
                                                    animate={{
                                                        height: "auto",
                                                        opacity: 1,
                                                    }}
                                                    exit={{
                                                        height: 0,
                                                        opacity: 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.3,
                                                    }}
                                                    className="mt-4 pt-4 border-t border-gray-200"
                                                >
                                                    <div className="space-y-4">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="flex items-center space-x-2">
                                                                <label className="text-sm font-medium">
                                                                    Skor:
                                                                </label>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="Masukkan skor"
                                                                    min="0"
                                                                    max="100"
                                                                    step="0.1"
                                                                    value={
                                                                        grading[
                                                                            submission
                                                                                .id
                                                                        ] !==
                                                                        undefined
                                                                            ? grading[
                                                                                  submission
                                                                                      .id
                                                                              ]
                                                                            : submission.skor ||
                                                                              ""
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setGrading(
                                                                            (
                                                                                prev
                                                                            ) => ({
                                                                                ...prev,
                                                                                [submission.id]:
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                            })
                                                                        )
                                                                    }
                                                                    className="w-24 h-8"
                                                                />
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        handleGrade(
                                                                            submission.id,
                                                                            grading[
                                                                                submission
                                                                                    .id
                                                                            ] !==
                                                                                undefined
                                                                                ? grading[
                                                                                      submission
                                                                                          .id
                                                                                  ]
                                                                                : submission.skor
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        !(grading[
                                                                            submission
                                                                                .id
                                                                        ] !==
                                                                        undefined
                                                                            ? parseFloat(
                                                                                  grading[
                                                                                      submission
                                                                                          .id
                                                                                  ]
                                                                              ) >
                                                                              0
                                                                            : submission.skor >
                                                                              0)
                                                                    }
                                                                >
                                                                    <Save className="w-4 h-4 mr-1" />
                                                                    Simpan
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-4">
                                                            {submission.jawaban
                                                                ?.file_path && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    asChild
                                                                >
                                                                    <a
                                                                        href={`/storage/${submission.jawaban.file_path}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        <Download className="w-4 h-4 mr-2" />
                                                                        Download
                                                                        Jawaban
                                                                    </a>
                                                                </Button>
                                                            )}
                                                            {submission.jawaban
                                                                ?.link && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    asChild
                                                                >
                                                                    <a
                                                                        href={
                                                                            submission
                                                                                .jawaban
                                                                                .link
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        Link
                                                                        Jawaban
                                                                    </a>
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Belum ada pengumpulan
                                </h3>
                                <p className="text-gray-600">
                                    Siswa belum mengumpulkan tugas ini.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
