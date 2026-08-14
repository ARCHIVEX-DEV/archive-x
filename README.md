# ARCHIVE X - Version sécurisée (Vercel)

## Contenu
- `index.html` → Site avec reCAPTCHA
- `archive-x-banner.png` → Image de bannière
- `favicon.gif` → Favicon du site
- `api/verify-recaptcha.js` → Vérification sécurisée de la clé secrète

## Déploiement sur Vercel

1. Va sur https://vercel.com et connecte-toi
2. Clique sur **Add New Project**
3. Uploade ce dossier (ou importe depuis GitHub)
4. Une fois déployé, va dans **Settings → Environment Variables**
5. Ajoute cette variable :
   - Name : `RECAPTCHA_SECRET_KEY`
   - Value : ta clé secrète reCAPTCHA
6. Clique sur **Save** puis **Redeploy** le projet

## Fonctionnement
1. Clic sur JOIN SERVER → confirmation
2. Clic sur OUI → affichage du reCAPTCHA
3. Validation du captcha → vérification côté serveur avec la clé secrète
4. Si OK → redirection vers Discord
