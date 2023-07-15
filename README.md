# Dashboard Internal

Dashboard untuk keperluan internal panitia OSKM

### Langkah-Langkah

1. Clone repo `git clone https://github.com/KATITB2023/dashboard-internal.git`
2. Install Yarn `npm install --global yarn`
3. Jalankan `yarn install`
4. Copy file `.env.example` menjadi `.env`
5. Ubah nilai dari `DATABASE_URL` menjadi alamat database kalian
6. Jalankan database migration. `yarn migrate-dev`
7. Jalankan local dev server. `yarn dev`

## Git Branching

Setiap repository akan memiliki 3 branch utama, yaitu master, development, dan production.
Setiap pembuatan branch baru, buat branch baru dengan base master.
Format: `<tipe>/<judul>`

List tipe:

- Story, untuk fitur atau use case baru
- Task, untuk bug fixing, performance improvement, refactor, dsb.

Judul: gunakan kebab case

Contoh:

- story/api-attendance
- story/page-attendance
- task/improve-sql-performance-on-xxxx-method

Setelah selesai, Pull Request ke master dan wajib minta peer review ke kadiv/wakadiv.

## Code Styling & Repository

Sangat dimohon untuk memperhatikan hal-hal berikut:

1. Penamaan variabel, fungsi, dan kelas yang bermakna
2. Penyingkatan harus mudah ditebak dan masih terbaca
   - Misalkan, codeStylingAndRepository, terlalu panjang, disingkat menjadi: codeStyleNRepo
   - Yang Salah: csnr, cdStNrep

## Semantic Commit Message

- `feat`: (new feature for the user, not a new feature for build script)
- `fix`: (bug fix for the user, not a fix to a build script)
- `docs`: (changes to the documentation)
- `style`: (formatting, missing semi colons, etc; no production code change)
- `refactor`: (refactoring production code, eg. renaming a variable)
- `test`: (adding missing tests, refactoring tests; no production code change)
- `chore`: (updating grunt tasks etc; no production code change)

### [SOP Developers Workflow](https://docs.google.com/document/d/1-4oVwVxLDdNSB2XVaOn4yLy0dI7WCb-5ydRP0Tk5-BE/edit)

### [Figma](https://www.figma.com/file/D13nNg1KRtBD8gNoPDPFIS/OSKM-2023?type=design&t=HfvyQWOFEdgD0gS6-6)
