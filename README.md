# DIM TEAM online sistem

Next.js + Supabase verzija sajta za DIM TEAM farbaru.

## Pokretanje

Najlakse: dvaput kliknite na `otvori-sajt.bat`.

Ili pokrenite:

```powershell
npm.cmd install
npm.cmd run dev
```

Otvorite `http://localhost:3000`.

Bez Supabase kljuceva aplikacija radi u demo rezimu:

- Kupac: `firmaA / 1234`
- Kupac: `firmaB / 1234`
- Admin: `admin / admin`
- Podrska: `podrska / 1234`

## Supabase povezivanje

1. Napravite Supabase projekat.
2. Kopirajte `.env.example` u `.env.local` i unesite kljuceve.
3. U Supabase SQL Editor-u pokrenite `supabase/migrations/202605310001_initial_schema.sql`.
4. Zatim pokrenite `supabase/seed.sql`.
5. Kreirajte Auth korisnike i povezite ih sa redovima u `profiles`.

`SUPABASE_SERVICE_ROLE_KEY` je iskljucivo server-side tajna. Nikada ga ne izlagati browseru.

## Implementirano

- Next.js App Router aplikacija sa profilnim menijem i gost login opcijom.
- Katalog, tri prikaza proizvoda, pretraga, korpa i kontakt mapa.
- Kupac: nalog, kredit, trenutno stanje duga, fakture i veleprodajne cene.
- Admin: odvojeni prozori za proizvode, veleprodaju, naloge, dozvole i postojece naloge.
- Zaposleni: panel i support sanduce.
- Supabase schema, RLS pravila, Storage bucket, Realtime publikacija i audit resetovanja sifre.
- Server-only endpoint za reset email i privremenu sifru.

## Napomena

Demo rezim je namenjen lokalnom pregledu. Za rad izmedju vise uredjaja potrebno je povezati Supabase projekat i email provajder za javni support chat.
