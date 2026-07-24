# Lumacon Website (Astryx + Vite)

Onepage-Website für Lumacon – autorisierter IMOS-Partner in Österreich.
Gebaut mit [Astryx](https://astryx.atmeta.com) (Meta Open-Source-Designsystem), React 19 und Vite.

## Lokal starten

```bash
npm install
npm run dev
```

## Deployment via GitHub + Netlify

1. Repo auf GitHub anlegen und dieses Projekt pushen:
   ```bash
   git init && git add -A && git commit -m "Lumacon Website"
   git remote add origin git@github.com:IHR-ACCOUNT/lumacon-website.git
   git push -u origin main
   ```
2. Auf [netlify.com](https://netlify.com): **Add new site → Import an existing project → GitHub** → Repo wählen.
3. Netlify erkennt die `netlify.toml` automatisch (Build: `npm run build`, Publish: `dist`). Nichts weiter einstellen.
4. Jeder Push auf `main` deployt automatisch. Pull Requests bekommen Deploy-Previews.
5. Eigene Domain: **Domain settings → Add custom domain → lumacon.at**.

Die Kurz-URL `lumacon.at/qs` leitet auf den TeamViewer-QuickSupport-Download um (siehe `netlify.toml`).

## Struktur

- `index.html` / `en/index.html` – Einstiegspunkte DE/EN
- `src/content.js` – **alle Texte** (DE + EN), hier Inhalte pflegen
- `src/Site.jsx` – Seitenaufbau (alle Sektionen)
- `src/lumacon-theme.css` – Lumacon-Theme als Astryx-Token-Overrides
- `src/NetworkBg.jsx` – animiertes Punktnetz (Hero/Technologie)

## Google Analytics

Mess-ID in `src/Site.jsx` bei `GA_MEASUREMENT_ID` eintragen. Lädt erst nach Cookie-Zustimmung.
