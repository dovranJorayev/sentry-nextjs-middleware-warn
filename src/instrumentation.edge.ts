import * as Sentry from '@sentry/nextjs';
import { Instrumentation } from 'next';
import { envConfig } from './shared/config';

export const register = async () => {
  // This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
  // The config you add here will be used whenever one of the edge features is loaded.
  // Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
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

export const onRequestError: Instrumentation.onRequestError =
  Sentry.captureRequestError;
