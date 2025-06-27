# Next.js + Sentry Middleware Webpack Cache Warning

This repository demonstrates a webpack cache warning that occurs when using Next.js middleware with Sentry configuration.

## Issue

When running `npm run build` with both Next.js middleware and Sentry HOC configured, the following warning appears:

```
<w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (253kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
```

## Steps to Reproduce

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the build**
   ```bash
   npm run build
   ```

3. **Observe the warning in console output**

## Analysis

### When the Warning Occurs
- ⚠️ **WITH** middleware.ts + Sentry HOC → Warning appears
- ✅ **WITHOUT** middleware.ts + Sentry HOC → No warning
- ✅ **WITH** middleware.ts + **WITHOUT** Sentry HOC → No warning

### Key Findings
1. The warning is triggered by the combination of Next.js middleware and Sentry's `withSentryConfig` HOC
2. The content/logic within the middleware doesn't matter - even an empty middleware function triggers it
3. Removing either the middleware file or the Sentry HOC eliminates the warning
4. The warning suggests that large strings (253kiB) are being serialized, impacting webpack cache performance

## Environment
- **Next.js**: 15.3.3
- **@sentry/nextjs**: 9.32.0
- **Node.js**: Latest LTS
- **TypeScript**: 5.7.2

## Expected Behavior
The build should complete without webpack cache warnings when using standard Next.js middleware with Sentry instrumentation.