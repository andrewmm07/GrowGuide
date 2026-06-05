# Refresh GrowGuide on your phone (Android)

The Android app does **not** load code from `npm run dev`. It uses a static copy in `out/`, copied into the native project by Capacitor.

## Every time you change UI

```powershell
cd c:\GrowGuide
npm run mobile:refresh
```

Then in **Android Studio**: Run ▶ (green play) on your device or emulator.

## Confirm you have the new build

On **Plan → This month**, scroll to the bottom of the month guide. You should see a small grey label:

**UI 4**

If you still see blue/green sow/plant pills or no `UI 4` label, the old app is still installed.

## App closes immediately on launch

If you previously turned on **notifications** in Settings, the app may crash on open when Firebase is not set up (`google-services.json` missing from `android/app/`). Rebuild after the latest code (remote push is skipped unless `NEXT_PUBLIC_FCM_CONFIGURED=true`), or add Firebase per [PUSH_NOTIFICATIONS.md](PUSH_NOTIFICATIONS.md).

To see the exact error: Android Studio → **Logcat**, filter by `growguide` or `Capacitor`, reproduce the crash.

## If it still looks old

1. **Uninstall** GrowGuide from the phone.
2. Run `npm run mobile:refresh` again.
3. Android Studio → **Build → Clean Project**, then Run ▶.
4. Optional: Settings → Apps → GrowGuide → **Clear storage** (if you reinstall without uninstalling).

## Browser preview (optional)

```powershell
npm run dev:phone
```

Open `http://<your-pc-ip>:3000` on the phone (same Wi‑Fi). That shows live code but is **not** the same as the installed Capacitor app.
