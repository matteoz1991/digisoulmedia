# Digisoul V2 - JM Bygg

Det här är ett modernt webbprojekt byggt med **Vite** och **React/JS**.

## Snabbstart för utveckling

För att köra igång projektet lokalt efter att du laddat ner det från GitHub:

1. Öppna mappen i din terminal (t.ex. VS Code Terminal).
2. Installera alla nödvändiga verktyg (som du just nu inte ser på GitHub eftersom de är för tunga):
   ```bash
   npm install
   ```
3. Starta utvecklingsservern:
   ```bash
   npm run dev
   ```
4. Besök länken som visas i terminalen (oftast `http://localhost:5173`).

## Varför ser jag inte alla mappar (node_modules)?

Mappen `node_modules` innehåller tusentals filer som behövs för att verktygen ska fungera, men de ska inte laddas upp till GitHub. Genom att köra `npm install` återskapas de på din dator på några sekunder. Detta håller projektet rent och snabbt att ladda upp/ner.

## Bygg för produktion

När du är redo att ladda upp projektet till en webbserver:
```bash
npm run build
```
Innehållet i mappen `dist` är det som ska laddas upp till din webbserver.
