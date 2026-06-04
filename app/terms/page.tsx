import Link from 'next/link'
import PageContainer from '@/app/components/layouts/PageContainer'
import { LEGAL } from '@/lib/legal/constants'

export const metadata = {
  title: 'Terms of Service — GrowGuide',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <PageContainer>
        <Link href="/settings/" className="text-sm text-green-700 hover:underline">
          ← Back to settings
        </Link>
        <article className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 max-w-3xl text-gray-800 space-y-6 text-sm leading-relaxed">
          <header>
            <h1 className="text-2xl font-bold text-gray-900">Terms of Service</h1>
            <p className="text-gray-500 mt-1">Last updated: June 2026</p>
          </header>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Service</h2>
            <p>
              GrowGuide is provided on behalf of <strong>{LEGAL.organisationName}</strong>
              {LEGAL.organisationStatus === 'registration pending' ? (
                <> (registration pending)</>
              ) : null}
              . It offers general gardening information and planning tools for Australian locations. The service is for informational purposes
              only and is not professional horticultural advice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Your responsibility</h2>
            <p>
              Planting dates, frost guidance, and weather suggestions are estimates. Local conditions vary.
              You are responsible for your gardening decisions and outcomes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Account &amp; acceptable use</h2>
            <p>
              Keep credentials secure. Do not attempt to access other users&apos; data, abuse the service, or
              overload our systems. We may suspend accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Disclaimer</h2>
            <p>
              The service is provided &quot;as is&quot; without warranties. To the maximum extent permitted by law,
              {LEGAL.organisationName}&apos;s liability is limited as described in our full terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Governing law</h2>
            <p>
              These terms are governed by the laws of {LEGAL.governingLaw} (operator location while{' '}
              {LEGAL.organisationName} registration is pending). Courts in {LEGAL.jurisdiction} have
              non-exclusive jurisdiction, subject to mandatory consumer protections under the Australian Consumer
              Law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Australian consumers</h2>
            <p>
              Nothing in these terms excludes rights you may have under the Australian Consumer Law that cannot
              be excluded.
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
