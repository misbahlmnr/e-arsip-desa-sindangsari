#!/usr/bin/env python3
"""Generate PlantUML sequence diagrams for ArsipDesa use cases."""

from __future__ import annotations

from pathlib import Path

OUTPUT_DIR = Path(__file__).parent / "sequence-diagrams"

SKINPARAM = """skinparam defaultFontName "Garamond"
skinparam defaultFontSize 12
skinparam TitleFontSize 14
skinparam SequenceMessageFontSize 11
skinparam SequenceParticipantFontSize 12
skinparam ActorFontSize 12"""

DIAGRAMS: dict[str, str] = {
    "uc01-login.puml": f"""@startuml
title Sequence Diagram Login

{SKINPARAM}

actor "Pengguna\\n(Admin / Sekdes / Kades)" as User
boundary "View\\n(Halaman Login)" as View
control "Controller\\n(AuthenticatedSessionController)" as Controller
control "Request\\n(LoginRequest)" as LoginRequest
control "Service\\n(DashboardService)" as Service
entity "Model\\n(User)" as Model
database "Database" as DB

User -> View : Mengakses halaman login
activate View
View -> Controller : GET /login (create)
activate Controller
Controller -> View : Render Inertia auth/Login
View -> User : Menampilkan form login
deactivate Controller

User -> View : Mengisi username & password
User -> View : Menekan tombol "Login"

View -> Controller : POST /login (store)
activate Controller
Controller -> LoginRequest : authenticate()
activate LoginRequest
LoginRequest -> Model : Auth::attempt(username, password)
activate Model
Model -> DB : Query data user
activate DB
DB --> Model : Data user & role
deactivate DB
deactivate Model
LoginRequest --> Controller : Hasil autentikasi
deactivate LoginRequest

alt Kredensial valid
    Controller -> Controller : session()->regenerate()
    Controller -> View : Redirect ke /dashboard
    View -> Controller : GET /dashboard
    activate Controller

    alt Peran = Admin
        Controller -> Controller : AdminDashboardController::index()
        Controller -> Service : DashboardService::admin()
        activate Service
        Service -> Model : Agregasi statistik surat
        activate Model
        Model -> DB : Query data dashboard
        activate DB
        DB --> Model : Data statistik
        deactivate DB
        deactivate Model
        Service --> Controller : summary, grafik
        deactivate Service
        Controller -> View : Render dashboard/Admin
        View -> User : Menampilkan Dashboard Admin
    else Peran = Sekdes
        Controller -> Controller : SekdesDashboardController::index()
        Controller -> Service : DashboardService::sekdes()
        activate Service
        Service -> Model : Agregasi statistik surat
        activate Model
        Model -> DB : Query data dashboard
        activate DB
        DB --> Model : Data statistik
        deactivate DB
        deactivate Model
        Service --> Controller : summary, grafik
        deactivate Service
        Controller -> View : Render dashboard/Sekdes
        View -> User : Menampilkan Dashboard Sekdes
    else Peran = Kades
        Controller -> Controller : KadesDashboardController::index()
        Controller -> Service : DashboardService::kades()
        activate Service
        Service -> Model : Agregasi statistik surat
        activate Model
        Model -> DB : Query data dashboard
        activate DB
        DB --> Model : Data statistik
        deactivate DB
        deactivate Model
        Service --> Controller : summary, grafik
        deactivate Service
        Controller -> View : Render dashboard/Kades
        View -> User : Menampilkan Dashboard Kades
    end
    deactivate Controller
else Kredensial tidak valid
    Controller -> View : ValidationException (auth.failed)
    View -> User : Menampilkan pesan gagal login
end

deactivate Controller
deactivate View
@enduml
""",
    "uc02-kelola-surat.puml": f"""@startuml
title Sequence Diagram Mengelola Surat Masuk & Keluar

{SKINPARAM}

actor "Pengguna\\n(Admin)" as User
boundary "View\\n(Surat Masuk / Keluar)" as View
control "Controller\\n(SuratMasukController /\\nSuratKeluarController)" as Controller
control "Request\\n(StoreRequest / UpdateRequest)" as FormRequest
control "Service\\n(SuratMasukService /\\nSuratKeluarService)" as Service
entity "Model\\n(SuratMasuk / SuratKeluar)" as Model
database "Database" as DB

User -> View : Mengakses menu Surat Masuk atau Surat Keluar
activate View
View -> Controller : GET index
activate Controller
Controller -> Service : index(request)
activate Service
Service -> Model : Query daftar surat aktif
activate Model
Model -> DB : SELECT surat
activate DB
DB --> Model : Daftar surat
deactivate DB
deactivate Model
Service --> Controller : letters + filters
deactivate Service
Controller -> View : Render surat-masuk/Index atau surat-keluar/Index
View -> User : Menampilkan daftar surat
deactivate Controller

User -> View : Memilih tambah / ubah / hapus surat
User -> View : Mengisi form data surat

View -> Controller : POST / PATCH / DELETE surat
activate Controller
Controller -> FormRequest : Validasi input & file
activate FormRequest
FormRequest --> Controller : Data tervalidasi
deactivate FormRequest

alt Data dan file valid
    Controller -> Service : store() / update() / destroy()
    activate Service

    alt Jenis = Surat Masuk
        Service -> Model : create() / update() / delete()
    else Jenis = Surat Keluar
        Service -> Model : create() / update() / delete()
    end

    activate Model
    Model -> DB : INSERT / UPDATE / DELETE
    activate DB
    DB --> Model : Konfirmasi
    deactivate DB
    deactivate Model
    Service --> Controller : Operasi berhasil
    deactivate Service
    Controller -> View : Redirect + pesan sukses
    View -> User : Menampilkan pesan berhasil
else Data atau file tidak valid
    Controller -> View : Error validasi
    View -> User : Menampilkan pesan error
end

deactivate Controller
deactivate View
@enduml
""",
    "uc03-kelola-arsip.puml": f"""@startuml
title Sequence Diagram Mengelola Arsip Surat

{SKINPARAM}

actor "Pengguna\\n(Admin)" as User
boundary "View\\n(Detail Surat)" as View
control "Controller\\n(SuratMasukController /\\nSuratKeluarController)" as Controller
control "Service\\n(SuratMasukService /\\nSuratKeluarService)" as Service
entity "Model\\n(SuratMasuk / SuratKeluar)" as Model
database "Database" as DB

User -> View : Membuka detail surat masuk / keluar
activate View
View -> Controller : GET show
activate Controller
Controller -> View : Render halaman detail surat
View -> User : Menampilkan detail surat
deactivate Controller

User -> View : Memilih arsipkan surat

View -> Controller : PATCH arsipkan
activate Controller
Controller -> Model : canArchive() / cek diarsipkan_at
activate Model
Model --> Controller : Status surat
deactivate Model

alt Syarat arsip terpenuhi
    Controller -> Service : archive(surat)
    activate Service
    Service -> Model : update status diarsipkan
    activate Model
    Model -> DB : UPDATE diarsipkan_at, status
    activate DB
    DB --> Model : OK
    deactivate DB
    deactivate Model
    Service --> Controller : Surat diarsipkan
    deactivate Service
    Controller -> View : Redirect + pesan berhasil
    View -> User : Menampilkan pesan arsip berhasil
else Surat belum didisposisikan
    Controller -> View : Redirect + pesan error
    View -> User : Surat harus didisposisikan terlebih dahulu
end

deactivate Controller
deactivate View
@enduml
""",
    "uc04-kelola-user.puml": f"""@startuml
title Sequence Diagram Mengelola User

{SKINPARAM}

actor "Pengguna\\n(Admin)" as User
boundary "View\\n(Manajemen User)" as View
control "Controller\\n(UserController)" as Controller
control "Request\\n(StoreRequest / UpdateRequest)" as FormRequest
control "Service\\n(UserService)" as Service
entity "Model\\n(User)" as Model
database "Database" as DB

User -> View : Mengakses menu Manajemen User
activate View
View -> Controller : GET admin/users
activate Controller
Controller -> Service : index(request)
activate Service
Service -> Model : Query daftar pengguna
activate Model
Model -> DB : SELECT users
activate DB
DB --> Model : Daftar user
deactivate DB
deactivate Model
Service --> Controller : users + filters
deactivate Service
Controller -> View : Render users/Index
View -> User : Menampilkan daftar pengguna
deactivate Controller

User -> View : Memilih tambah / ubah / hapus pengguna
User -> View : Mengisi form data pengguna

View -> Controller : POST / PATCH / DELETE user
activate Controller

alt Bukan ubah role akun sendiri
    Controller -> FormRequest : Validasi input
    activate FormRequest
    FormRequest --> Controller : Data tervalidasi
    deactivate FormRequest

    alt Data valid
        Controller -> Service : store() / update() / destroy()
        activate Service
        Service -> Model : create() / update() / delete()
        activate Model
        Model -> DB : INSERT / UPDATE / DELETE
        activate DB
        DB --> Model : Konfirmasi
        deactivate DB
        deactivate Model
        Service --> Controller : Operasi berhasil
        deactivate Service
        Controller -> View : Redirect + pesan sukses
        View -> User : Menampilkan pesan berhasil
    else Data tidak valid
        Controller -> View : Error validasi
        View -> User : Menampilkan pesan error validasi
    end
else Mencoba ubah role akun sendiri
    Controller -> View : Error role akun sendiri
    View -> User : Tidak dapat mengubah peran akun sendiri
end

deactivate Controller
deactivate View
@enduml
""",
    "uc05-review-surat.puml": f"""@startuml
title Sequence Diagram Review Surat Masuk

{SKINPARAM}

actor "Pengguna\\n(Sekdes)" as User
boundary "View\\n(Detail Surat Masuk)" as View
control "Controller\\n(SuratMasukController)" as Controller
control "Request\\n(ReviewSekdesRequest)" as FormRequest
control "Service\\n(SuratMasukService)" as Service
entity "Model\\n(SuratMasuk)" as Model
database "Database" as DB

User -> View : Mengakses menu Surat Masuk
activate View
View -> Controller : GET surat-masuk
activate Controller
Controller -> Service : index(request)
activate Service
Service -> Model : Query surat draft
activate Model
Model -> DB : SELECT surat_masuk
activate DB
DB --> Model : Daftar surat
deactivate DB
deactivate Model
Service --> Controller : letters
deactivate Service
Controller -> View : Render surat-masuk/Index
View -> User : Menampilkan daftar surat masuk
deactivate Controller

User -> View : Memilih surat berstatus draft
View -> Controller : GET surat-masuk/{{id}}
activate Controller
Controller -> View : Render surat-masuk/Show
View -> User : Menampilkan detail surat

User -> View : Menentukan tingkat surat & konfirmasi review
View -> Controller : PATCH review-sekdes
Controller -> FormRequest : authorize() + validasi tingkat
activate FormRequest
FormRequest -> Model : canReviewBySekdes()
activate Model
Model --> FormRequest : Status boleh review
deactivate Model

alt Status draft & belum direview
    FormRequest --> Controller : Data valid
    deactivate FormRequest
    Controller -> Service : reviewBySekdes(surat, tingkat, user)
    activate Service
    Service -> Model : update tingkat & status terverifikasi
    activate Model
    Model -> DB : UPDATE surat_masuk
    activate DB
    DB --> Model : OK
    deactivate DB
    deactivate Model
    Service --> Controller : Review berhasil
    deactivate Service
    Controller -> View : Redirect + pesan sukses
    View -> User : Menampilkan pesan berhasil
else Surat tidak dapat direview
    FormRequest --> Controller : Unauthorized / validasi gagal
    deactivate FormRequest
    Controller -> View : Pesan error
    View -> User : Surat tidak dapat direview
end

deactivate Controller
deactivate View
@enduml
""",
    "uc06-verifikasi-surat.puml": f"""@startuml
title Sequence Diagram Verifikasi Surat Masuk

{SKINPARAM}

actor "Pengguna\\n(Kades)" as User
boundary "View\\n(Detail Surat Masuk)" as View
control "Controller\\n(SuratMasukController)" as Controller
control "Request\\n(VerifikasiKadesRequest)" as FormRequest
control "Service\\n(SuratMasukService)" as Service
entity "Model\\n(SuratMasuk)" as Model
database "Database" as DB

User -> View : Mengakses menu Surat Masuk
activate View
View -> Controller : GET surat-masuk
activate Controller
Controller -> Service : index(request)
activate Service
Service -> Model : Query surat penting
activate Model
Model -> DB : SELECT surat_masuk
activate DB
DB --> Model : Daftar surat
deactivate DB
deactivate Model
Service --> Controller : letters
deactivate Service
Controller -> View : Render surat-masuk/Index
View -> User : Menampilkan daftar surat masuk
deactivate Controller

User -> View : Memilih surat penting menunggu verifikasi
View -> Controller : GET surat-masuk/{{id}}
activate Controller
Controller -> View : Render surat-masuk/Show
View -> User : Menampilkan detail surat

User -> View : Konfirmasi verifikasi surat
View -> Controller : PATCH verifikasi-kades
Controller -> FormRequest : authorize() + validasi
activate FormRequest
FormRequest -> Model : canVerifyByKades()
activate Model
Model --> FormRequest : Status boleh verifikasi
deactivate Model

alt Surat penting & sudah direview Sekdes
    FormRequest --> Controller : Data valid
    deactivate FormRequest
    Controller -> Service : verifyByKades(surat, user)
    activate Service
    Service -> Model : update verified_kades_at
    activate Model
    Model -> DB : UPDATE surat_masuk
    activate DB
    DB --> Model : OK
    deactivate DB
    deactivate Model
    Service --> Controller : Verifikasi berhasil
    deactivate Service
    Controller -> View : Redirect + pesan sukses
    View -> User : Menampilkan pesan berhasil
else Verifikasi ditolak
    FormRequest --> Controller : Unauthorized / validasi gagal
    deactivate FormRequest
    Controller -> View : Pesan error
    View -> User : Verifikasi ditolak
end

deactivate Controller
deactivate View
@enduml
""",
    "uc07-disposisi.puml": f"""@startuml
title Sequence Diagram Pemberian Disposisi

{SKINPARAM}

actor "Pengguna\\n(Sekdes / Kades)" as User
boundary "View\\n(Disposisi / Detail Surat)" as View
control "Controller\\n(DisposisiController)" as Controller
control "Request\\n(StoreRequest /\\nStoreFromSuratRequest)" as FormRequest
control "Service\\n(DisposisiService)" as Service
entity "Model\\n(Disposisi / SuratMasuk)" as Model
database "Database" as DB

User -> View : Mengakses menu Disposisi atau detail surat
activate View
View -> Controller : GET disposisi / surat-masuk/{{id}}
activate Controller
Controller -> Service : index() / suratOptions()
activate Service
Service -> Model : Query surat eligible
activate Model
Model -> DB : SELECT surat_masuk
activate DB
DB --> Model : Daftar surat
deactivate DB
deactivate Model
Service --> Controller : Data surat
deactivate Service
Controller -> View : Render disposisi/Create atau Show
View -> User : Menampilkan form disposisi
deactivate Controller

User -> View : Memilih jabatan tujuan & mengisi catatan
View -> Controller : POST disposisi
activate Controller
Controller -> FormRequest : Validasi input
activate FormRequest
FormRequest --> Controller : Data tervalidasi
deactivate FormRequest

Controller -> Service : store() / storeFromSurat()
activate Service
Service -> Model : assertCanCreate(surat, user)
activate Model
Model --> Service : Syarat disposisi
deactivate Model

alt Syarat disposisi terpenuhi
    Service -> Model : Disposisi::create()
    activate Model
    Model -> DB : INSERT disposisi
    activate DB
    DB --> Model : OK
    deactivate DB
    deactivate Model
    Service -> Model : advanceSuratStatus() -> didisposisikan
    activate Model
    Model -> DB : UPDATE status surat_masuk
    activate DB
    DB --> Model : OK
    deactivate DB
    deactivate Model
    Service --> Controller : Disposisi tersimpan
    deactivate Service
    Controller -> View : Redirect + pesan sukses
    View -> User : Menampilkan pesan berhasil
else Syarat belum terpenuhi
    Service --> Controller : ValidationException
    deactivate Service
    Controller -> View : Pesan error
    View -> User : Syarat disposisi belum terpenuhi
end

deactivate Controller
deactivate View
@enduml
""",
    "uc08-pencarian-arsip.puml": f"""@startuml
title Sequence Diagram Pencarian Arsip Surat

{SKINPARAM}

actor "Pengguna\\n(Admin / Sekdes / Kades)" as User
boundary "View\\n(Arsip Surat)" as View
control "Controller\\n(ArsipSuratController)" as Controller
control "Service\\n(ArsipSuratService)" as Service
control "Service\\n(SuratNomorSearchService)" as SearchService
control "Service\\n(BinarySearchService)" as BinarySearch
entity "Model\\n(SuratMasuk / SuratKeluar)" as Model
database "Database" as DB

User -> View : Mengakses menu Arsip Surat
activate View
View -> User : Menampilkan halaman arsip

User -> View : Memasukkan prefix nomor surat & filter
View -> Controller : GET arsip-surat?search=...
activate Controller
Controller -> Service : index(request)
activate Service
Service -> Model : Query arsip (diarsipkan_at NOT NULL)
activate Model
Model -> DB : SELECT arsip
activate DB
DB --> Model : Kandidat arsip
deactivate DB
deactivate Model

Service -> SearchService : matchingIds(query, prefix)
activate SearchService
SearchService -> BinarySearch : findPrefixRange(no_surat)
activate BinarySearch
BinarySearch --> SearchService : Rentang indeks cocok
deactivate BinarySearch
SearchService --> Service : Daftar ID cocok
deactivate SearchService

alt Data ditemukan
    Service -> Model : Filter whereIn(id)
    activate Model
    Model -> DB : SELECT hasil pencarian
    activate DB
    DB --> Model : Daftar arsip
    deactivate DB
    deactivate Model
    Service --> Controller : letters + filters
    deactivate Service
    Controller -> View : Render arsip-surat/Index
    View -> User : Menampilkan daftar hasil pencarian

    User -> View : Membuka detail arsip
    View -> Controller : GET arsip-surat/{{jenis}}/{{id}}
    Controller -> Model : find arsip
    activate Model
    Model -> DB : SELECT detail arsip
    activate DB
    DB --> Model : Data arsip
    deactivate DB
    deactivate Model
    Controller -> View : Render arsip-surat/Show
    View -> User : Menampilkan detail arsip
else Data tidak ditemukan
    Service --> Controller : Daftar kosong
    deactivate Service
    Controller -> View : Render arsip-surat/Index (kosong)
    View -> User : Menampilkan pesan tidak ditemukan
end

deactivate Controller
deactivate View
@enduml
""",
    "uc09-laporan.puml": f"""@startuml
title Sequence Diagram Rekapitulasi & Laporan Arsip Surat

{SKINPARAM}

actor "Pengguna\\n(Admin / Sekdes / Kades)" as User
boundary "View\\n(Laporan)" as View
control "Controller\\n(LaporanController)" as Controller
control "Service\\n(LaporanService)" as Service
entity "Model\\n(SuratMasuk / SuratKeluar /\\nDisposisi)" as Model
database "Database" as DB

User -> View : Mengakses menu Laporan
activate View
View -> User : Menampilkan halaman laporan

User -> View : Memilih rentang waktu laporan
View -> Controller : GET laporan?range=...
activate Controller
Controller -> Service : index(request) / buildReport()
activate Service
Service -> Model : Agregasi statistik surat & arsip
activate Model
Model -> DB : SELECT COUNT, GROUP BY
activate DB
DB --> Model : Data rekapitulasi
deactivate DB
deactivate Model
Service --> Controller : summary, grafik, tren
deactivate Service
Controller -> View : Render laporan/Index
View -> User : Menampilkan statistik & grafik

alt Export PDF
    User -> View : Klik unduh laporan PDF
    View -> Controller : GET laporan/export
    Controller -> Service : exportPdf(request)
    activate Service
    Service -> Model : buildReport()
    activate Model
    Model -> DB : Query data laporan
    activate DB
    DB --> Model : Data laporan
    deactivate DB
    deactivate Model
    Service -> Service : Generate PDF (DomPDF)
    Service --> Controller : File PDF
    deactivate Service
    Controller -> View : Download laporan-surat.pdf
    View -> User : Mengunduh file PDF
else Hanya lihat di layar
    User -> View : Melihat rekapitulasi di halaman
end

deactivate Controller
deactivate View
@enduml
""",
    "uc10-logout.puml": f"""@startuml
title Sequence Diagram Logout

{SKINPARAM}

actor "Pengguna\\n(Admin / Sekdes / Kades)" as User
boundary "View\\n(Layout / Header)" as View
control "Controller\\n(AuthenticatedSessionController)" as Controller
control "Auth\\n(guard web)" as Auth

User -> View : Memilih Logout pada menu profil
activate View
View -> Controller : POST /logout (destroy)
activate Controller

alt Sesi aktif
    Controller -> Auth : logout()
    activate Auth
    Auth --> Controller : Sesi diakhiri
    deactivate Auth
    Controller -> Controller : session()->invalidate()
    Controller -> Controller : session()->regenerateToken()
    Controller -> View : Redirect ke /login
    View -> User : Menampilkan halaman login
else Sesi sudah berakhir
    Controller -> View : Redirect ke /login
    View -> User : Menampilkan halaman login
end

deactivate Controller
deactivate View
@enduml
""",
}


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for filename, content in DIAGRAMS.items():
        path = OUTPUT_DIR / filename
        path.write_text(content.strip() + "\n", encoding="utf-8")
        print(f"Generated: {path}")
    print(f"Done: {len(DIAGRAMS)} sequence diagrams in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
