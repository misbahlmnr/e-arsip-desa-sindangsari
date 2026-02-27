import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Show({ adaptiveRule }) {
    return (
        <AppLayout>
            <Head title="Detail Adaptive Rule" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Detail Adaptive Rule
                    </h1>
                    <div className="flex space-x-2">
                        <Button variant="outline" asChild>
                            <Link
                                href={route(
                                    "guru.adaptive-rules.edit",
                                    adaptiveRule.id
                                )}
                            >
                                Edit
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={route("guru.adaptive-rules.index")}>
                                Kembali
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Detail Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Adaptive Rule</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Mata Pelajaran
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {adaptiveRule.mapel?.nama}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Min Score
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {adaptiveRule.min_score}
                                </p>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Kategori Rekomendasi
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {adaptiveRule.kategori_rekomendasi}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Dibuat Pada
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {new Date(
                                        adaptiveRule.created_at
                                    ).toLocaleDateString("id-ID")}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Diupdate Pada
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {new Date(
                                        adaptiveRule.updated_at
                                    ).toLocaleDateString("id-ID")}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
