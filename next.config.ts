import { withSentryConfig } from '@sentry/nextjs';
import { NextConfig } from 'next';

const fallbackRelease = `local_${Date.now().toString(36)}`;
const envMap = {
  development: {
    BUILD_ENV: 'development',
    NEXT_PUBLIC_SENTRY_DSN:
      'https://xxx',
    NEXT_PUBLIC_SENTRY_PROJECT: 'nextjs-sentry-warning',
    NEXT_PUBLIC_SENTRY_ORG: 'nextjs-sentry-warning',
    NEXT_PUBLIC_SENTRY_DISABLED: 'true',
    NEXT_PUBLIC_SENTRY_RELEASE: process.env.CI_COMMIT_SHA || fallbackRelease,
  },
  staging: {
    BUILD_ENV: 'staging',
    NEXT_PUBLIC_SENTRY_DSN:
      'https://xxx',
    NEXT_PUBLIC_SENTRY_PROJECT: 'nextjs-sentry-warning',
    NEXT_PUBLIC_SENTRY_ORG: 'nextjs-sentry-warning',
    NEXT_PUBLIC_SENTRY_DISABLED: 'false',
    NEXT_PUBLIC_SENTRY_RELEASE: process.env.CI_COMMIT_SHA || fallbackRelease,
  },
  production: {
    BUILD_ENV: 'production',
    NEXT_PUBLIC_SENTRY_DSN:
      'https://xxx',
    NEXT_PUBLIC_SENTRY_PROJECT: 'x_frontend',
    NEXT_PUBLIC_SENTRY_ORG: 'x',
    NEXT_PUBLIC_SENTRY_DISABLED: 'false',
    NEXT_PUBLIC_SENTRY_RELEASE: process.env.CI_COMMIT_SHA || fallbackRelease,
  },
};

// prettier-ignore
const BUILD_ENV = (process.env.BUILD_ENV || 'development') as keyof typeof envMap;
// prettier-ignore
const SENTRY_DISABLED = envMap[BUILD_ENV].NEXT_PUBLIC_SENTRY_DISABLED === 'true';
const SENTRY_ORG = envMap[BUILD_ENV].NEXT_PUBLIC_SENTRY_ORG;
const SENTRY_PROJECT = envMap[BUILD_ENV].NEXT_PUBLIC_SENTRY_PROJECT;
const SENTRY_RELEASE = envMap[BUILD_ENV].NEXT_PUBLIC_SENTRY_RELEASE;

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@sentry/nextjs'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  env: {
    ...envMap[BUILD_ENV as keyof typeof envMap],
  },
  pageExtensions: ['tsx', 'ts'],
};

// export default nextConfig;

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: SENTRY_ORG,
  project: SENTRY_PROJECT,

  // Add release configuration
  release: {
    name: SENTRY_RELEASE,
    setCommits: {
      auto: true,
    },
  },

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: !SENTRY_DISABLED,

  unstable_sentryWebpackPluginOptions: {
    disable: SENTRY_DISABLED,
  },

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: false,
  sourcemaps: {
    disable: SENTRY_DISABLED,
    deleteSourcemapsAfterUpload: true,
  },
  telemetry: !SENTRY_DISABLED,
  bundleSizeOptimizations: {
    excludeReplayIframe: true,
    excludeReplayWorker: true,
    excludeReplayShadowDom: true,
    excludeDebugStatements: true,
    excludeTracing: false,
  },
});
