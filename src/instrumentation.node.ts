import * as Sentry from '@sentry/nextjs';
import { envConfig } from '@shared/config';
import { Instrumentation } from 'next';

export const register = async () => {
  // This file configures the initialization of Sentry on the server.
  // The config you add here will be used whenever the server handles a request.
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/

  Sentry.init({
    dsn: envConfig.sentryDsn,

    // Add release and environment information
    release: envConfig.sentryRelease,
    environment: envConfig.buildEnv,

    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
  });
};

/**
 * NOTE: This should be observed by the time as it is unsure what to do yet
 * @see https://posthog.com/docs/libraries/node Q&A section
 * @see https://posthog.com/docs/libraries/node#using-in-a-short-lived-process-like-aws-lambda
 * @see https://posthog.com/docs/libraries/next-js?tab=Pages+router getServerSideProps example
 * @see https://nextjs.org/docs/app/guides/open-telemetry Open telemetry uses singletons instead of transient instances (oppocity to what we do here)
 * @see https://posthog.com/tutorials/nextjs-error-monitoring Posthog Next.js integration also uses singletons (opposity to what we do here)
 */
export const onRequestError: Instrumentation.onRequestError = Sentry.captureRequestError

