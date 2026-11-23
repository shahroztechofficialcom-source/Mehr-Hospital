# MEHR HOSPITAL — Next.js 15 demo

## Run locally
1. Install Node.js 20.9 or newer.
2. Extract the ZIP and open the `mehr-hospital` folder in VS Code.
3. Run:

```bash
npm install
npm run dev
```

4. Open http://localhost:3000

## Demo logins
Password for each seeded demo account: `123456`
- Patient: `patient@mehr.com`
- Doctor: `doctor@mehr.com`
- Admin: `admin@mehr.com`

New sign-ups create **Patient** accounts only. Staff roles must be provisioned by a real server-side admin workflow before production use.

## Included pages and features
- Home, Services, Doctors directory, Doctor detail, Patients, About, Contact
- Login and patient sign-up with validation, password confirmation rules, SHA-256 password digest in local browser storage, and role-based demo redirects
- Header account state, dashboard access, and logout
- Patient dashboard with appointment status tabs and cancellation
- Doctor demo dashboard with approve/reject actions
- Admin demo dashboard with add/remove doctor profiles and user listing
- Appointment request form with working-day checks and local duplicate-slot checks
- MediBot demo assistant, responsive navigation, theme toggle, Framer Motion authentication transitions

## Important limitations — read before presenting
- This is a **classroom/demo prototype**, not a production hospital system.
- Supabase is not connected. `.env.local` is empty; `.env.example` is only a template.
- Sessions, users, appointments and doctor additions use browser `localStorage`. They do not sync between devices and can be edited or cleared by the browser user.
- SHA-256 in the browser is only a demo convenience. It is not a secure password-storage/authentication system. Production needs a server-side auth provider, salted password hashing (e.g. Argon2id), secure HTTP-only cookies, server-side role checks, rate limiting, and recovery flows.
- Client-side dashboard role checks are not security boundaries. Never store real patient data in this version.
- Appointment slot checks are local and not atomic; production needs database transactions/unique constraints to prevent concurrent double bookings.
- Medical records and prescriptions are placeholders. Do not enter real patient or medical data.
- Hospital address, contact details, facilities and statistics are demo content. Verify and replace them before public deployment.
- Doctor photos use remote Unsplash images. Replace them with approved/licensed hospital assets before publication.

## Stack
Next.js 15, React 19, Tailwind CSS v4, Framer Motion, Swiper.js, Lucide React, TypeScript.
