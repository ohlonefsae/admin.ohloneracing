# Ohlone Renegades — Dynamic Pages Backend (Cloudflare D1)

## Quick setup

1. **Create the D1 database**
   ```bash
   npx wrangler d1 create renegades-db
   ```
   Copy the `database_id` into `wrangler.jsonc`.

2. **Apply the schema**
   ```bash
   npx wrangler d1 execute renegades-db --file=./schema.sql
   ```

3. **Set the admin password**
   In the Cloudflare dashboard (Pages project → Settings → Environment variables)  
   or in `wrangler.jsonc` under `vars`:
   ```
   ADMIN_PASSWORD = your-strong-password
   ```

4. **Deploy**
   Push the project (including the `functions/` folder) to your Cloudflare Pages project.

## Endpoints

| Method | Path                  | Description                    |
|--------|-----------------------|--------------------------------|
| POST   | `/api/login`          | Login (sets cookie)            |
| GET    | `/api/pages`          | List all pages (auth required) |
| POST   | `/api/pages`          | Create page (auth)             |
| PUT    | `/api/pages/:id`      | Update page (auth)             |
| DELETE | `/api/pages/:id`      | Delete page (auth)             |
| GET    | `/api/pages/public`   | Published nav pages (public)   |
| GET    | `/:slug`              | Render a published page        |

## Notes

- The main site already fetches `/api/pages/public` and injects nav links.
- Published pages are available at `https://yourdomain.com/your-slug`.
- Admin is at `admin.ohloneracing.org` (point the subdomain at the same Pages project or a separate one that shares the D1 binding).
- For production, replace the simple cookie check with a proper session store (KV or D1 sessions table).
