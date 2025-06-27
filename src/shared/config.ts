export const envConfig = {
  buildEnv: process.env.BUILD_ENV as 'development' | 'staging' | 'production',
  cookieDomain: process.env.COOKIE_DOMAIN as string,
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN as string,
  sentryProject: process.env.NEXT_PUBLIC_SENTRY_PROJECT as string,
  sentryOrg: process.env.NEXT_PUBLIC_SENTRY_ORG as string,
  sentryDisabled: !!process.env.NEXT_PUBLIC_SENTRY_DISABLED,
  sentryRelease: process.env.NEXT_PUBLIC_SENTRY_RELEASE as string,
};
