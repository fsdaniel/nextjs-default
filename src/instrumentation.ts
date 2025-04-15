// This file is created as part of the Next.js instrumentation
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

export async function register() {
  console.log('Server instrumentation registered');
}

// No-op function to replace captureRequestError
export const onRequestError = () => {}; 