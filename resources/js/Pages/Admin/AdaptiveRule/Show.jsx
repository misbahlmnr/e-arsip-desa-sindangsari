import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Show({ adaptiveRule }) {
    return (
        <AppLayout>
            <Head
                title={`Detail Adaptive Rule - ${adaptiveRule.kategori_rekomendasi}`}
            />

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
                                    "admin.adaptive-rule.edit",
                                    adaptiveRule.id
                                )}
                            >
                                Edit
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={route("admin.adaptive-rule.index")}>
                                Kembali
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Data Adaptive Rule */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Adaptive Rule</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Mata Pelajaran
                                </label>
                                <p className="text-sm text-gray-900">
                                    {adaptiveRule.mapel?.nama || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Min Score
                                </label>
                                <p className="text-sm text-gray-900">
                                    {adaptiveRule.min_score}
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Kategori Rekomendasi
                                </label>
                                <p className="text-sm text-gray-900">
                                    {adaptiveRule.kategori_rekomendasi}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Dibuat
                                </label>
                                <p className="text-sm text-gray-900">
                                    {new Date(
                                        adaptiveRule.created_at
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Diperbarui
                                </label>
                                <p className="text-sm text-gray-900">
                                    {new Date(
                                        adaptiveRule.updated_at
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
