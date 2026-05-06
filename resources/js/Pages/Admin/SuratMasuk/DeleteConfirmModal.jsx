import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { router } from "@inertiajs/react";

const DeleteConfirmModal = ({ letter, confirmDelete, setConfirmDelete }) => {
    const handleDelete = () => {
        router.delete(
            route("admin.surat-masuk.destroy", { surat_masuk: letter.id }),
        );
    };

    return (
        <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus surat ini?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Surat{" "}
                        <span className="font-mono font-semibold text-foreground">
                            {letter.no_surat}
                        </span>{" "}
                        beserta riwayat disposisinya akan dihapus permanen.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Hapus Surat
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteConfirmModal;
