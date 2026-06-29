# Life OS

Kişisel "ikinci beyin" — Next.js + Supabase.

## Stack
- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4
- Supabase (Postgres + Auth, RLS)

## Kurulum

```bash
npm install
cp .env.example .env.local   # değerleri doldur
npm run dev
```

### Ortam değişkenleri (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Veritabanı
`supabase/schema.sql` dosyasını Supabase SQL Editor'de bir kez çalıştır.
Tüm tablolarda RLS aktif; kullanıcı sadece kendi satırlarını görür.

## Yapı
- `src/app/login` — e-posta/şifre giriş + kayıt
- `src/app/dashboard` — sidebar + bento panel
- `src/app/dashboard/space/[id]` — space sayfası (içerik Aşama 2'de)
- `src/components/sidebar` — gruplar + space'ler (CRUD, ok ile sıralama)
- `src/components/ui` — Button, Input, Modal, BentoCard
- `src/lib/supabase` — client/server/proxy istemcileri
- `src/proxy.ts` — oturum tazeleme + rota koruma

## Space tipleri
`standard` · `tracker` · `kanban` · `language` — iç özellikler sonra eklenecek.
