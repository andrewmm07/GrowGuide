# Privacy Policy

**Last updated:** June 2026  
**App:** GrowGuide (`au.org.pivot.growguide`)  
**Contact:** andrew@pivot.org.au (interim — support@frankhouse.com.au when available)

GrowGuide helps you plan and manage a home garden with location-aware planting guidance. This policy describes what data we collect and how we use it.

---

## 1. Who we are

GrowGuide is operated on behalf of **FrankHouse Ltd** (Australian company **registration pending**) (“we”, “us”). For privacy enquiries, contact **andrew@pivot.org.au**.

---

## 2. Data we collect

### Account data

When you create an account, we store:

- Email address and display name
- Authentication credentials (managed by Supabase Auth; we do not store plain-text passwords)

### Location data

To provide climate- and zone-specific advice, we store:

- City, state, and coordinates you select or approve
- Derived gardening context (e.g. Australian hardiness zone, climate classification, microclimate tags)

You can update location in the app settings.

### Garden data

- Plants you add to your garden, planting dates, schedules, and tasks you create
- Projects and custom tasks

### Device data (optional — push notifications)

If you enable push notifications on Android:

- Firebase Cloud Messaging device token
- Platform (e.g. `android`)

### Usage and diagnostics (optional)

If error reporting is enabled (`NEXT_PUBLIC_SENTRY_DSN`), we may receive crash reports including device type, app version, and stack traces. We do not intentionally send passwords or garden content in crash reports.

### Weather

We request forecast data from WeatherAPI.com using your location (city/coordinates). WeatherAPI’s privacy policy applies to their processing: [weatherapi.com](https://www.weatherapi.com/).

---

## 3. How we use data

We use your data to:

- Authenticate you and keep your session secure
- Personalise planting calendars, weekly briefs, and garden schedules
- Send in-app and push notifications you have opted into
- Improve reliability (error reporting, if enabled)

We do **not** sell your personal data.

---

## 4. Where data is stored

Data is stored in **Supabase** (hosted PostgreSQL) in the region configured for our Supabase project. Backups and security are subject to Supabase’s terms and our configuration (Row Level Security on user data).

---

## 5. Sharing

We share data only with service providers needed to run the app:

| Provider | Purpose |
|----------|---------|
| Supabase | Database, authentication, server functions |
| WeatherAPI.com | Weather forecasts |
| Google Firebase | Push notification delivery (Android) |
| Sentry (optional) | Error monitoring |

We may disclose data if required by law.

---

## 6. Retention

We retain account and garden data while your account is active. You may request account deletion by contacting **andrew@pivot.org.au** — we will delete or anonymise personal data within a reasonable period, subject to legal retention requirements.

---

## 7. Your choices

- **Location:** Update or remove reliance on device location by choosing a city manually
- **Notifications:** Disable in app settings; unregister device push token
- **Account:** Request deletion via support email

---

## 8. Security

We use industry-standard practices including HTTPS, Supabase Row Level Security, and restricted server keys. No system is completely secure; please use a strong unique password.

---

## 9. Children

GrowGuide is not directed at children under 13. We do not knowingly collect data from children.

---

## 10. Changes

We may update this policy. The “Last updated” date will change. Continued use after changes constitutes acceptance of the updated policy.

---

## 11. Contact

**FrankHouse Ltd** (registration pending)  
**andrew@pivot.org.au**
