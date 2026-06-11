# Configuración — Guía paso a paso

Esta guía es para Samuel. Está hecha para que la sigas en orden, click por click. No vas a tocar código — solo copiar y pegar claves entre páginas.

> El sitio público (`/`, `/portfolio`, `/servicios`, `/bodas`, `/nosotros`, `/contacto`) **ya funciona** en https://casa-web-chi.vercel.app. Lo que sigue habilita las galerías privadas, las reservas con seña, la tienda y el mail.

---

## 1) Resend — para que el formulario te avise por mail

Sin esto, el formulario de `/contacto` igual dice "Recibimos tu consulta", pero el mail no llega a tu gmail.

1. Entrá a https://resend.com/signup y registrate con `somoscasa.ar@gmail.com`.
2. En el panel: **API Keys → Create API Key**. Nombre: `casa-web`. Permission: **Sending access**. Copiala (empieza con `re_`).
3. (Opcional pero recomendado) **Domains → Add Domain → somoscasa.com.ar**. Resend te muestra unos registros DNS para pegar cuando registres el dominio. Mientras tanto, podés usar el sender de prueba `onboarding@resend.dev`.
4. Andá a **Vercel** → tu proyecto `casa-web` → **Settings → Environment Variables** y agregá:

```
RESEND_API_KEY = re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM    = CASA <onboarding@resend.dev>   (cambialo a contacto@somoscasa.com.ar cuando verifiques el dominio)
```

5. En Vercel → **Deployments → Redeploy**. Probá el form y revisá tu gmail.

---

## 2) Supabase — para galerías privadas (Fase 2)

1. Entrá a https://supabase.com/dashboard y registrate con Google (somoscasa.ar@gmail.com).
2. **New Project**:
   - Name: `casa`
   - Database Password: anotalo en un lugar seguro
   - Region: **South America (São Paulo)** — el más cercano
   - Plan: **Free** alcanza para empezar
3. Mientras provisiona (~2 min), andá a **Project Settings → API**. Vas a ver:
   - **Project URL** → copialo
   - **anon public** key → copiala
   - **service_role** key → copiala (¡es secreta, no la compartas!)
4. En Vercel → **Environment Variables**, agregá:

```
NEXT_PUBLIC_SUPABASE_URL      = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY     = eyJhbGciOi...
NEXT_PUBLIC_ADMIN_EMAILS      = somoscasa.ar@gmail.com
```

5. Volvé a Supabase → **SQL Editor → New query**. Abrí el archivo `supabase/schema.sql` de este repo, copialo entero, pegalo en el editor y dale **Run**. Crea las tablas y el bucket `photos`.

6. Activá los emails de magic link: **Authentication → URL Configuration**:
   - Site URL: `https://casa-web-chi.vercel.app`
   - Additional redirect URLs: `https://casa-web-chi.vercel.app/admin`
7. **Authentication → Providers → Email**: dejá habilitado solo Email (los demás los podés apagar). Activá **Magic Link**.
8. Vercel → Redeploy.
9. Entrá a `https://casa-web-chi.vercel.app/admin` → poné tu mail → te llega un link → clickeás → ya estás dentro del panel. Creá tu primera galería.

---

## 3) MercadoPago — para reservas + tienda (Fases 3 y 4)

1. Entrá a https://www.mercadopago.com.ar/developers → **Tus integraciones → Crear aplicación**:
   - Nombre: `casa-web`
   - Solución: **Pagos online**
   - Producto: **Checkout Pro**
2. Una vez creada, andá a **Credenciales**:
   - **Credenciales de producción**: copiá el `Access Token` y el `Public Key`.
3. En Vercel agregá:

```
MERCADOPAGO_ACCESS_TOKEN          = APP_USR-xxxxxx-xxxxxx
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY = APP_USR-xxxxxx
NEXT_PUBLIC_DEPOSIT_AMOUNT         = 200000      # ← seña fija en ARS. Cambiala cuando quieras.
```

4. (Opcional para producción) Configurá el webhook en **Tus integraciones → casa-web → Webhooks → Configurar**:
   - URL: `https://casa-web-chi.vercel.app/api/mp/webhook`
   - Eventos: **Pagos**
5. Vercel → Redeploy. Probá `/reservar` y `/tienda`.

---

## 4) Dominio `somoscasa.com.ar` (cuando lo registres)

1. Compralo en **NIC.ar** (necesita tu CUIT).
2. En Vercel → tu proyecto → **Settings → Domains → Add → `somoscasa.com.ar`**.
3. Vercel te dice qué poner en el DNS:
   - Tipo `A` → `76.76.21.21`
   - O `CNAME` `www` → `cname.vercel-dns.com`
4. Cargalos en el panel de NIC.ar.
5. Cuando esté activo, actualizá en Vercel:

```
NEXT_PUBLIC_SITE_URL = https://somoscasa.com.ar
```

Y en Resend → Domains, completá el DNS de `somoscasa.com.ar` para enviar mails desde `contacto@somoscasa.com.ar`.

---

## Atajos

- Panel admin: **`/admin`** (login por magic-link)
- Galería de cliente: **`/clientes/<token>`** (cada cliente recibe su link cuando creás su galería)
- Reservar: **`/reservar`**
- Tienda: **`/tienda`**

---

## Si algo no anda

- El sitio sigue funcionando aunque falten algunas claves: las páginas que requieren backend muestran "Próximamente" en vez de romperse.
- Logs en Vercel: tu proyecto → **Logs** → filtrá por `/api/...` para ver errores.
