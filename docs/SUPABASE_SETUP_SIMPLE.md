# Supabase setup (simple)

One-time setup so the GrowGuide app can save gardens and read plant data.

## Step 1 — Run the schema (2 minutes)

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project  
2. **SQL Editor** → **New query**  
3. Open file `supabase/setup-minimal-beta.sql` in this repo  
4. Copy **all** of it → paste into SQL Editor  
5. Click **Run**

**Success:** Bottom shows `Setup complete` and **8 table names**.

**If error:** Copy the full error message — don’t run old `001` or `20240320` files separately.

---

## Step 2 — Load plant data (5–10 minutes)

1. SQL Editor → **New query**  
2. Open **`supabase/seeds/plant_timelines_complete.sql`** (full data — use this file, not `plant_timelines_seed.sql`)  
3. Paste → **Run** (may take a while)

Check:

```sql
SELECT COUNT(*) AS plants FROM plant_timelines;
```

**Success:** not `0`. Typical counts:
- **~200** if you ran `plant_timelines_complete.sql` only
- **~818** if you imported `plant_timelines_corrected.csv` or already had full data

Either is fine. You do **not** need both.

---

## Step 3 — Test on phone (5 minutes)

1. Rebuild if you changed `.env.local`:

   ```powershell
   npm run build:mobile
   npm run mobile:sync
   ```

2. On phone: sign up → set location → add a plant  

3. In SQL Editor:

```sql
SELECT name, user_id FROM garden_plants ORDER BY created_at DESC LIMIT 3;
```

You should see your plant.

---

## Step 4 — Auth URLs (clicks, not SQL)

**Authentication → URL Configuration**

- Redirect URLs: add `http://localhost:3000/**` and your web URL if you have one  

**Providers → Email:** ON  

---

## Done

You can skip the 17 separate files in `supabase/migrations/` for a fresh project — use this script instead.

For push notifications later: `docs/PUSH_NOTIFICATIONS.md`.
