# oberstufe.site – Next.js v4.0 mit Clerk

## Setup (einmalig, dauert 5 Minuten)

### 1. Dependencies installieren
```bash
npm install
```

### 2. Clerk Keys eintragen
1. Geh auf https://dashboard.clerk.com
2. Wähle deine App (oder erstelle eine neue)
3. Geh zu **API Keys**
4. Kopiere **Publishable key** und **Secret key**
5. Dupliziere `.env.local.example` → `.env.local`
6. Füge die Keys ein

### 3. Lokal starten
```bash
npm run dev
# → http://localhost:3000
```

### 4. Auf Vercel deployen
```bash
npx vercel --prod
```
Oder per GitHub → Vercel verbinden.

**Wichtig:** In Vercel die Env-Variablen unter **Settings → Environment Variables** eintragen!

---

## Admin-Bereich

URL: `deine-domain.de/admin`

Clerk schützt automatisch alle `/admin/*` Routen.
Nur eingeloggte User können das Dashboard sehen.

### Wer darf sich einloggen?
Im Clerk-Dashboard unter **Users** kannst du Nutzer einladen oder auf "Email allowlist" setzen.

---

## Projektstruktur

```
src/
  app/
    page.jsx              ← Startseite
    powerpoints/page.jsx  ← PowerPoints
    videos/page.jsx       ← Videos
    spiele/page.jsx       ← Spiele
    admin/
      layout.jsx          ← Clerk-geschützt
      dashboard/page.jsx  ← Karten verwalten
  components/
    SiteHeader.jsx        ← Header + Mobile Nav
    SiteFooter.jsx        ← Footer
    CardGrid.jsx          ← Karten aus cards.json
  middleware.js           ← Clerk Middleware (schützt /admin)

public/
  data/cards.json         ← Alle Projektkarten
  presentations/          ← PDF Downloads
```

## cards.json aktualisieren

Im Admin-Dashboard kannst du Karten bearbeiten und die aktualisierte `cards.json` kopieren. Füge sie in `public/data/cards.json` ein und push zu Vercel.
