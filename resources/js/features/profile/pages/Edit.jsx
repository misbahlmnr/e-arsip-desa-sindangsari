import { Head } from "@inertiajs/react";
import DeleteUserForm from "../components/DeleteUserForm";
import UpdatePasswordForm from "../components/UpdatePasswordForm";
import UpdateProfileInformationForm from "../components/UpdateProfileInformationForm";
import AppLayout from "@/layouts/AppLayout";

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AppLayout title="Profil" subtitle="Kelola informasi akun Anda.">
            <Head title="Profil" />

            <div className="space-y-6 max-w-3xl">
                <div className="surface-card p-6 md:p-8">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                <div className="surface-card p-6 md:p-8">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                <div className="surface-card p-6 md:p-8">
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </AppLayout>
    );
}
