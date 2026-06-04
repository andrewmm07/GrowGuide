import Link from 'next/link'
import PageContainer from '@/app/components/layouts/PageContainer'
import { LEGAL } from '@/lib/legal/constants'

export const metadata = {
  title: 'Privacy Policy — GrowGuide',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <PageContainer>
        <Link href="/settings/" className="text-sm text-green-700 hover:underline">
          ← Back to settings
        </Link>
        <article className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 max-w-3xl text-gray-800 space-y-6 text-sm leading-relaxed">
          <header>
            <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-gray-500 mt-1">Last updated: June 2026</p>
          </header>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Who we are</h2>
            <p>
              GrowGuide is operated on behalf of <strong>{LEGAL.organisationName}</strong>
              {LEGAL.organisationStatus === 'registration pending' ? (
                <> (Australian company registration pending)</>
              ) : null}
              . For privacy enquiries, contact{' '}
              <a href={`mailto:${LEGAL.supportEmail}`} className="text-green-700 hover:underline">
                {LEGAL.supportEmail}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Data we collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Account:</strong> email, display name, and authentication data (via Supabase Auth).
              </li>
              <li>
                <strong>Location:</strong> city, state, coordinates, and derived gardening context (hardiness
                zone, climate) that you select or approve.
              </li>
              <li>
                <strong>Garden:</strong> plants, schedules, tasks, and projects you create.
              </li>
              <li>
                <strong>Push (optional):</strong> Firebase device token if you enable Android notifications.
              </li>
              <li>
                <strong>Diagnostics (optional):</strong> crash reports if error reporting (Sentry) is enabled.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">How we use data</h2>
            <p>
              We use your data to authenticate you, personalise planting guidance, deliver notifications you opt
              into, and improve reliability. We do not sell your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Service providers</h2>
            <p>
              Supabase (database &amp; auth), WeatherAPI.com (forecasts), Google Firebase (push on Android), and
              optionally Sentry (error monitoring).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Your choices</h2>
            <p>
              Update location in settings, disable notifications, or email{' '}
              <a href={`mailto:${LEGAL.supportEmail}`} className="text-green-700 hover:underline">
                {LEGAL.supportEmail}
              </a>{' '}
              to request account deletion.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Contact</h2>
            <p>
              <strong>{LEGAL.organisationName}</strong>
              <br />
              <a href={`mailto:${LEGAL.supportEmail}`} className="text-green-700 hover:underline">
                {LEGAL.supportEmail}
              </a>
            </p>
          </section>
        </article>
      </PageContainer>
    </div>
  )
}
