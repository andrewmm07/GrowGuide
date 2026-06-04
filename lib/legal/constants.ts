/**
 * Legal entity details — single source for in-app pages.
 * Keep in sync with docs/PRIVACY_POLICY.md and docs/TERMS_OF_SERVICE.md
 *
 * FrankHouse Ltd: intended operator name; Australian company registration not yet completed.
 * support@frankhouse.com.au: create before Play Store production / wide public release.
 */
export const LEGAL = {
  organisationName: 'FrankHouse Ltd',
  /** Shown in privacy/terms; registration not yet completed. */
  organisationStatus: 'registration pending' as const,
  /**
   * Monitored inbox for privacy, terms, and account requests.
   * Interim: project contact until support@frankhouse.com.au is set up.
   */
  supportEmail: 'andrew@pivot.org.au',
  plannedSupportEmail: 'support@frankhouse.com.au',
  /**
   * Governing law for Terms while unregistered: state/territory where the operator is based.
   * Update if FrankHouse Ltd registers in a different state.
   */
  governingLaw: 'Tasmania, Australia',
  jurisdiction: 'Tasmania',
} as const
