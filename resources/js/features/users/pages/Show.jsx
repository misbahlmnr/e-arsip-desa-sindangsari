import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/StatusBadge";
import AppLayout from "@/layouts/AppLayout";

const ROLE_LABEL_MAP = {
    admin: "Admin",
    sekdes: "Sekretaris Desa",
    kades: "Kepala Desa",
};
import { formatTanggalKalenderWib } from "@/shared/lib/utils";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

function Field({ label, value, className }) {
    return (
        <div className={className}>
            <dt className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {label}
            </dt>
            <dd className="text-sm font-medium text-foreground mt-1 leading-relaxed">
                {value || "—"}
            </dd>
        </div>
    );
}

export default function UsersShow({ user }) {
    const { props } = usePage();
    const authUserId = props.auth?.user?.id;
    const isSelf = authUserId === user.id;
    const [confirmDelete, setConfirmDelete] = useState(false);

    return (
        <AppLayout
            title="Detail Pengguna"
            subtitle={user.name}
            actions={
                <Button asChild variant="outline" className="rounded-xl h-10">
                    <Link href={route("admin.users.index")}>
                        <ArrowLeft className="size-4 mr-1.5" />
                        Kembali
                    </Link>
                </Button>
            }
        >
            <Head title={`Pengguna — ${user.name}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="surface-card p-6 md:p-8">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                    Nama
                                </p>
                                <p className="text-xl font-bold mt-1">
                                    {user.name}
                                </p>
                                <p className="font-mono text-sm text-muted-foreground mt-1">
                                    @{user.username}
                                </p>
                            </div>
                            <RoleBadge
                                value={user.role}
                                label={ROLE_LABEL_MAP[user.role] ?? user.role}
                            />
                        </div>

                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                            <Field label="Email" value={user.email} />
                            <Field
                                label="Terdaftar"
                                value={
                                    user.created_at
                                        ? formatTanggalKalenderWib(
                                              user.created_at,
                                          )
                                        : null
                                }
                            />
                        </dl>

                        <div className="mt-7 pt-5 border-t border-border flex flex-wrap items-center gap-2">
                            <Button asChild className="rounded-xl">
                                <Link
                                    href={route("admin.users.edit", {
                                        user: user.id,
                                    })}
                                >
                                    <Pencil className="size-4 mr-1.5" />
                                    Edit
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-xl text-destructive hover:text-destructive hover:bg-red-50 border-destructive/30 disabled:opacity-40"
                                disabled={isSelf}
                                title={
                                    isSelf
                                        ? "Tidak dapat menghapus akun sendiri"
                                        : undefined
                                }
                                onClick={() => setConfirmDelete(true)}
                            >
                                <Trash2 className="size-4 mr-1.5" />
                                Hapus
                            </Button>
                        </div>
                    </div>
                </div>

                <aside className="surface-card p-6 md:p-8 self-start">
                    <h3 className="font-bold text-base">Ringkasan</h3>
                    <p className="text-sm text-muted-foreground mt-0.5 mb-5">
                        Akun untuk masuk ke sistem dengan peran terpilih.
                    </p>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">Peran</span>
                            <RoleBadge
                                value={user.role}
                                label={ROLE_LABEL_MAP[user.role] ?? user.role}
                            />
                        </div>
                    </div>
                </aside>
            </div>

            <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus pengguna ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Akun{" "}
                            <span className="font-semibold text-foreground">
                                {user.name}
                            </span>{" "}
                            akan dihapus permanen dan tidak dapat masuk lagi.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() =>
                                router.delete(
                                    route("admin.users.destroy", {
                                        user: user.id,
                                    }),
                                )
                            }
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Hapus Pengguna
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
