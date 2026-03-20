# Kalorienrechner

Einfacher Kalorienrechner zur Berechnung von Grundumsatz, TDEE und Makroverteilung.
Gebaut mit Next.js 14, TypeScript und Tailwind CSS. Läuft vollständig im Browser, keine Datenbank, kein Backend.

## Lokal starten

```bash
npm install
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

## Deployment auf Vercel

### 1. Git-Repository anlegen

```bash
cd e:/ClaudeProjekte/Kalorien
git init
git add .
git commit -m "Initial commit"
```

### 2. Zu GitHub pushen

1. Neues Repository auf [github.com/new](https://github.com/new) anlegen (ohne README, ohne .gitignore)
2. Remote hinzufügen und pushen:

```bash
git remote add origin https://github.com/DEIN-USERNAME/kalorienrechner.git
git branch -M main
git push -u origin main
```

### 3. In Vercel importieren

1. Gehe zu [vercel.com/new](https://vercel.com/new)
2. Klicke auf **"Import Git Repository"**
3. Wähle dein `kalorienrechner`-Repository aus
4. Vercel erkennt Next.js automatisch – alle Einstellungen bleiben Standard
5. Klicke **Deploy**

### 4. Domain aufrufen

Nach dem Deploy erhältst du eine URL im Format `kalorienrechner-xxx.vercel.app`.
Unter **Settings → Domains** kannst du eine eigene Domain hinterlegen.
