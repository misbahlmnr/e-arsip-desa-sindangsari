<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => ':attribute harus disetujui.',
    'accepted_if' => ':attribute harus disetujui jika :other adalah :value.',
    'active_url' => ':attribute harus berupa URL yang valid.',
    'after' => ':attribute harus setelah :date.',
    'after_or_equal' => ':attribute harus setelah atau sama dengan :date.',
    'alpha' => ':attribute hanya boleh berisi huruf.',
    'alpha_dash' => ':attribute hanya boleh berisi huruf, angka, strip, dan garis bawah.',
    'alpha_num' => ':attribute hanya boleh berisi huruf dan angka.',
    'any_of' => ':attribute tidak valid.',
    'array' => ':attribute tidak valid.',
    'ascii' => ':attribute berisi karakter yang tidak didukung.',
    'before' => ':attribute harus sebelum :date.',
    'before_or_equal' => ':attribute harus sebelum atau sama dengan :date.',
    'between' => [
        'array' => ':attribute harus antara :min dan :max item.',
        'file' => 'Ukuran :attribute harus antara :min dan :max KB.',
        'numeric' => ':attribute harus antara :min dan :max.',
        'string' => ':attribute harus antara :min dan :max karakter.',
    ],
    'boolean' => ':attribute tidak valid.',
    'can' => ':attribute tidak valid.',
    'confirmed' => 'Konfirmasi :attribute tidak sesuai.',
    'contains' => ':attribute belum lengkap.',
    'current_password' => 'Kata sandi saat ini tidak sesuai.',
    'date' => ':attribute tidak valid.',
    'date_equals' => ':attribute harus sama dengan :date.',
    'date_format' => ':attribute harus sesuai format :format.',
    'decimal' => ':attribute harus memiliki :decimal angka di belakang koma.',
    'declined' => ':attribute harus ditolak.',
    'declined_if' => ':attribute harus ditolak jika :other adalah :value.',
    'different' => ':attribute dan :other harus berbeda.',
    'digits' => ':attribute harus :digits digit.',
    'digits_between' => ':attribute harus antara :min dan :max digit.',
    'dimensions' => 'Ukuran gambar :attribute tidak sesuai.',
    'distinct' => ':attribute tidak boleh sama.',
    'doesnt_contain' => ':attribute tidak boleh berisi :values.',
    'doesnt_end_with' => ':attribute tidak boleh diakhiri :values.',
    'doesnt_start_with' => ':attribute tidak boleh diawali :values.',
    'email' => 'Masukkan :attribute yang valid.',
    'ends_with' => ':attribute harus diakhiri :values.',
    'enum' => ':attribute tidak valid.',
    'exists' => ':attribute tidak valid.',
    'extensions' => ':attribute harus berformat :values.',
    'file' => ':attribute harus berupa berkas.',
    'filled' => ':attribute wajib diisi.',
    'gt' => [
        'array' => ':attribute harus lebih dari :value item.',
        'file' => 'Ukuran :attribute harus lebih dari :value KB.',
        'numeric' => ':attribute harus lebih dari :value.',
        'string' => ':attribute harus lebih dari :value karakter.',
    ],
    'gte' => [
        'array' => ':attribute minimal :value item.',
        'file' => 'Ukuran :attribute minimal :value KB.',
        'numeric' => ':attribute minimal :value.',
        'string' => ':attribute minimal :value karakter.',
    ],
    'hex_color' => ':attribute harus berupa warna yang valid.',
    'image' => ':attribute harus berupa gambar.',
    'in' => ':attribute tidak valid.',
    'in_array' => ':attribute tidak ada di :other.',
    'in_array_keys' => ':attribute harus berisi salah satu dari :values.',
    'integer' => ':attribute harus berupa angka bulat.',
    'ip' => ':attribute harus berupa alamat IP yang valid.',
    'ipv4' => ':attribute harus berupa alamat IPv4 yang valid.',
    'ipv6' => ':attribute harus berupa alamat IPv6 yang valid.',
    'json' => ':attribute tidak valid.',
    'list' => ':attribute tidak valid.',
    'lowercase' => ':attribute harus huruf kecil.',
    'lt' => [
        'array' => ':attribute harus kurang dari :value item.',
        'file' => 'Ukuran :attribute harus kurang dari :value KB.',
        'numeric' => ':attribute harus kurang dari :value.',
        'string' => ':attribute harus kurang dari :value karakter.',
    ],
    'lte' => [
        'array' => ':attribute maksimal :value item.',
        'file' => 'Ukuran :attribute maksimal :value KB.',
        'numeric' => ':attribute maksimal :value.',
        'string' => ':attribute maksimal :value karakter.',
    ],
    'mac_address' => ':attribute harus berupa alamat MAC yang valid.',
    'max' => [
        'array' => ':attribute maksimal :max item.',
        'file' => 'Ukuran :attribute maksimal :max KB.',
        'numeric' => ':attribute maksimal :max.',
        'string' => ':attribute maksimal :max karakter.',
    ],
    'max_digits' => ':attribute maksimal :max digit.',
    'mimes' => ':attribute harus berformat :values.',
    'mimetypes' => ':attribute harus berformat :values.',
    'min' => [
        'array' => ':attribute minimal :min item.',
        'file' => 'Ukuran :attribute minimal :min KB.',
        'numeric' => ':attribute minimal :min.',
        'string' => ':attribute minimal :min karakter.',
    ],
    'min_digits' => ':attribute minimal :min digit.',
    'missing' => ':attribute tidak boleh diisi.',
    'missing_if' => ':attribute tidak boleh diisi jika :other adalah :value.',
    'missing_unless' => ':attribute tidak boleh diisi kecuali :other adalah :value.',
    'missing_with' => ':attribute tidak boleh diisi jika :values ada.',
    'missing_with_all' => ':attribute tidak boleh diisi jika :values ada.',
    'multiple_of' => ':attribute harus kelipatan :value.',
    'not_in' => ':attribute tidak valid.',
    'not_regex' => 'Format :attribute tidak sesuai.',
    'numeric' => ':attribute harus berupa angka.',
    'password' => [
        'letters' => ':attribute harus berisi minimal satu huruf.',
        'mixed' => ':attribute harus berisi huruf besar dan huruf kecil.',
        'numbers' => ':attribute harus berisi minimal satu angka.',
        'symbols' => ':attribute harus berisi minimal satu simbol.',
        'uncompromised' => ':attribute ini pernah bocor. Gunakan kata sandi lain.',
    ],
    'present' => ':attribute wajib ada.',
    'present_if' => ':attribute wajib ada jika :other adalah :value.',
    'present_unless' => ':attribute wajib ada kecuali :other adalah :value.',
    'present_with' => ':attribute wajib ada jika :values ada.',
    'present_with_all' => ':attribute wajib ada jika :values ada.',
    'prohibited' => ':attribute tidak boleh diisi.',
    'prohibited_if' => ':attribute tidak boleh diisi jika :other adalah :value.',
    'prohibited_if_accepted' => ':attribute tidak boleh diisi jika :other disetujui.',
    'prohibited_if_declined' => ':attribute tidak boleh diisi jika :other ditolak.',
    'prohibited_unless' => ':attribute tidak boleh diisi kecuali :other adalah :values.',
    'prohibits' => ':attribute tidak boleh diisi bersamaan dengan :other.',
    'regex' => 'Format :attribute tidak sesuai.',
    'required' => ':attribute wajib diisi.',
    'required_array_keys' => ':attribute harus berisi :values.',
    'required_if' => ':attribute wajib diisi jika :other adalah :value.',
    'required_if_accepted' => ':attribute wajib diisi jika :other disetujui.',
    'required_if_declined' => ':attribute wajib diisi jika :other ditolak.',
    'required_unless' => ':attribute wajib diisi kecuali :other adalah :values.',
    'required_with' => ':attribute wajib diisi jika :values ada.',
    'required_with_all' => ':attribute wajib diisi jika :values ada.',
    'required_without' => ':attribute wajib diisi jika :values tidak ada.',
    'required_without_all' => ':attribute wajib diisi jika :values tidak ada.',
    'same' => ':attribute dan :other harus sama.',
    'size' => [
        'array' => ':attribute harus :size item.',
        'file' => 'Ukuran :attribute harus :size KB.',
        'numeric' => ':attribute harus :size.',
        'string' => ':attribute harus :size karakter.',
    ],
    'starts_with' => ':attribute harus diawali :values.',
    'string' => ':attribute harus berupa teks.',
    'timezone' => ':attribute harus berupa zona waktu yang valid.',
    'unique' => ':attribute sudah digunakan.',
    'uploaded' => ':attribute gagal diunggah.',
    'uppercase' => ':attribute harus huruf besar.',
    'url' => ':attribute harus berupa URL yang valid.',
    'ulid' => ':attribute tidak valid.',
    'uuid' => ':attribute tidak valid.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [
        'name' => 'nama',
        'username' => 'username',
        'email' => 'alamat email',
        'password' => 'password',
        'password_confirmation' => 'konfirmasi kata sandi',
        'current_password' => 'kata sandi saat ini',
        'role' => 'peran',
        'no_surat' => 'nomor surat',
        'tanggal_surat' => 'tanggal surat',
        'tanggal_terima' => 'tanggal diterima',
        'tanggal_kirim' => 'tanggal kirim',
        'pengirim' => 'pengirim',
        'perihal' => 'perihal',
        'tujuan' => 'tujuan',
        'catatan' => 'catatan',
        'file' => 'berkas',
        'supporting_files' => 'dokumen pendukung',
        'jabatan_tujuan_id' => 'tujuan disposisi',
        'tingkat' => 'tingkat surat',
        'surat_masuk_id' => 'surat',
        'tanggal' => 'tanggal',
    ],

];
