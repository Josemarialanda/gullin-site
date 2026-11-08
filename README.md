# Gullin site

The Gullin waiting-list landing page. Live at **https://gullin-site.vercel.app**.

It is a plain static site: HTML, CSS and a little JavaScript. There is no build step and nothing to install.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The page. |
| `assets/css/site.css` | Page styles. |
| `assets/css/tokens.css`, `clay-bundle.css` | Clay design-system colors, type and spacing. |
| `assets/css/fonts.css`, `assets/fonts/` | Self-hosted Inter and Hanken Grotesk fonts. |
| `assets/js/site.js` | English/Spanish copy, the language switch and the waiting-list form. |

## Updating the site

1. **Edit the files.**
   - Text is in `assets/js/site.js`, in the `COPY` object. Change both `en` and `es`. The text in `index.html` is only what shows before the script runs, so keep it in line with the English copy.
   - Layout and colors are in `assets/css/site.css`.

2. **Preview locally** from this folder:

   ```bash
   npx --yes http-server@14.1.1 . -p 4321 -c-1
   ```

   Then open http://localhost:4321. Opening `index.html` straight from disk also works, but a local server is closer to the live site.

3. **Save the change to GitHub:**

   ```bash
   git add -A
   git commit -m "Describe the change"
   git push
   ```

4. **Publish to the live site:**

   ```bash
   npx vercel@50 deploy --prod --scope jose-maria-landa-chavez
   ```

   This needs the Vercel CLI to be signed in (`npx vercel@50 login` the first time on a new computer). Pushing to GitHub alone does **not** update the live site, because the repo isn't connected to Vercel. To make every push to `main` deploy automatically, connect the repo in the Vercel dashboard under the `gullin-site` project, **Settings → Git**.

To undo a bad release, open the project's **Deployments** list in the Vercel dashboard and promote an earlier deployment.

## Waiting-list signups

The form sends each signup to [Web3Forms](https://web3forms.com), which emails it to the address the access key was created with. The key is `WEB3FORMS_ACCESS_KEY` at the top of `assets/js/site.js`. It is meant to be public: it can only send form emails to that one address.

The free plan allows 250 submissions a month. To send signups somewhere else, create a new key on web3forms.com and replace the one in `site.js`, then publish.
