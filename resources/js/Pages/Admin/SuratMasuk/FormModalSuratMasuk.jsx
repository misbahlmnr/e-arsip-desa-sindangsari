import { router } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Field, FieldError, FieldLabel } from "@/Components/ui/field";

const STATUS_OPTIONS = [
    { value: "belum_diproses", label: "Belum Diproses" },
    { value: "sedang_diproses", label: "Sedang Diproses" },
    { value: "selesai", label: "Selesai" },
];

const DEFAULT_VALUES = {
    nomor_registrasi: "",
    no_surat: "",
    tanggal_terima: "",
    pengirim: "",
    perihal: "",
    status: "belum_diproses",
    tujuan: "-",
    file: null,
};

function letterToFormValues(letter) {
    const tanggal =
        typeof letter.tanggal_terima === "string"
            ? letter.tanggal_terima.slice(0, 10)
            : letter.tanggal_terima
              ? String(letter.tanggal_terima).slice(0, 10)
              : "";

    return {
        nomor_registrasi: letter.nomor_registrasi ?? "",
        no_surat: letter.no_surat ?? "",
        tanggal_terima: tanggal,
        pengirim: letter.pengirim ?? "",
        perihal: letter.perihal ?? "",
        status: letter.status ?? "belum_diproses",
        tujuan: letter.tujuan ?? "-",
        file: null,
    };
}

const FormModalSuratMasuk = (props) => {
    const { isOpen, onClose, letter } = props;
    const [processing, setProcessing] = useState(false);

    const isEdit = Boolean(letter?.id);

    const { control, handleSubmit, setError, reset } = useForm({
        defaultValues: DEFAULT_VALUES,
    });

    useEffect(() => {
        if (!isOpen) {
            reset(DEFAULT_VALUES);
            return;
        }
        if (letter?.id) {
            reset(letterToFormValues(letter));
        } else {
            reset(DEFAULT_VALUES);
        }
    }, [isOpen, letter, reset]);

    const fileRules = useMemo(
        () => (isEdit ? {} : { required: "File wajib diunggah." }),
        [isEdit],
    );

    const onSubmit = (values) => {
        setProcessing(true);

        const finish = {
            onSuccess: () => {
                onClose();
                reset(DEFAULT_VALUES);
            },
            onError: (serverErrors) => {
                if (serverErrors) {
                    Object.entries(serverErrors).forEach(([key, val]) => {
                        const message = Array.isArray(val)
                            ? val[0]
                            : typeof val === "string"
                              ? val
                              : val?.message;

                        if (typeof message === "string" && key) {
                            setError(key, {
                                type: "server",
                                message,
                            });
                        }
                    });
                }
            },
            onFinish: () => {
                setProcessing(false);
            },
        };

        if (isEdit) {
            const { file, ...fields } = values;
            const updateUrl = route("admin.surat-masuk.update", {
                surat_masuk: letter.id,
            });

            if (file instanceof File) {
                router.post(
                    updateUrl,
                    { ...fields, _method: "put", file },
                    {
                        forceFormData: true,
                        preserveScroll: true,
                        ...finish,
                    },
                );
            } else {
                router.put(updateUrl, fields, {
                    preserveScroll: true,
                    ...finish,
                });
            }

            return;
        }

        router.post(route("admin.surat-masuk.store"), values, {
            forceFormData: true,
            preserveScroll: true,
            ...finish,
        });
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(next) => {
                if (!next) {
                    onClose();
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Edit Surat Masuk" : "Tambah Surat Masuk"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Perbarui informasi surat masuk. Kosongkan unggahan file jika tidak ingin mengganti lampiran."
                            : "Masukkan detail informasi surat masuk baru. Klik simpan ketika selesai."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-2 py-4">
                        <Controller
                            name="nomor_registrasi"
                            control={control}
                            rules={{
                                required: "Nomor registrasi wajib diisi.",
                            }}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel
                                        htmlFor={field.name}
                                        className="text-right text-sm"
                                    >
                                        No. Registrasi
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Contoh: REG-001"
                                    />
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />

                        <Controller
                            name="no_surat"
                            control={control}
                            rules={{ required: "No. surat wajib diisi." }}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel
                                        htmlFor={field.name}
                                        className="text-right text-sm"
                                    >
                                        No. Surat
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Contoh: SM-001"
                                    />
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />

                        <Controller
                            name="tanggal_terima"
                            control={control}
                            rules={{ required: "Tanggal wajib diisi." }}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel
                                        htmlFor={field.name}
                                        className="text-right text-sm"
                                    >
                                        Tanggal
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="date"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />

                        <Controller
                            name="pengirim"
                            control={control}
                            rules={{ required: "Pengirim wajib diisi." }}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel
                                        htmlFor={field.name}
                                        className="text-right text-sm"
                                    >
                                        Pengirim
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Contoh: Dinas Pendidikan"
                                    />
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />

                        <Controller
                            name="perihal"
                            control={control}
                            rules={{ required: "Perihal wajib diisi." }}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel
                                        htmlFor={field.name}
                                        className="text-right text-sm"
                                    >
                                        Perihal
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Contoh: Undangan Rapat"
                                    />
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />

                        <Controller
                            name="status"
                            control={control}
                            rules={{ required: "Status wajib diisi." }}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel
                                        htmlFor={field.name}
                                        className="text-right text-sm"
                                    >
                                        Status
                                    </FieldLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                        >
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUS_OPTIONS.map((opt) => (
                                                <SelectItem
                                                    key={opt.value}
                                                    value={opt.value}
                                                >
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />

                        <Controller
                            name="tujuan"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel
                                        htmlFor={field.name}
                                        className="text-right text-sm"
                                    >
                                        Tujuan
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Contoh: Kasi Pelayanan"
                                    />
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />

                        <Controller
                            name="file"
                            control={control}
                            rules={fileRules}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel
                                        htmlFor={field.name}
                                        className="text-right text-sm"
                                    >
                                        File
                                        {isEdit ? (
                                            <span className="text-left block font-normal text-muted-foreground text-xs mt-0.5">
                                                Opsional — biarkan kosong untuk
                                                mempertahankan file saat ini.
                                            </span>
                                        ) : null}
                                    </FieldLabel>
                                    {isEdit && letter?.file_url ? (
                                        <p className="text-xs text-muted-foreground mb-1">
                                            Lampiran saat ini:{" "}
                                            <a
                                                href={letter.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary underline underline-offset-2"
                                            >
                                                lihat file
                                            </a>
                                        </p>
                                    ) : null}
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        aria-invalid={fieldState.invalid}
                                        onBlur={field.onBlur}
                                        ref={field.ref}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.files?.[0] ?? null,
                                            )
                                        }
                                    />
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default FormModalSuratMasuk;
