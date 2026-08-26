import InputError from "@/components/InputError";
import PrimaryButton from "@/components/PrimaryButton";
import TextInput from "@/components/TextInput";
import GuestLayout from "@/layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <GuestLayout>
            <Head title="Lupa Password" />

            <p className="mb-4 text-sm text-muted-foreground">
                Masukkan email akun Anda. Kami akan mengirim tautan untuk
                mengatur ulang password.
            </p>

            {status && (
                <div className="mb-4 text-sm font-medium text-success">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    placeholder="email@desa.go.id"
                    onChange={(e) => setData("email", e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="flex items-center justify-end">
                    <PrimaryButton disabled={processing}>
                        Kirim tautan reset
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
