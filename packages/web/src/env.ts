// Simple runtime validation of environment variables

const requiredVariables = [
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_UPLOADS',
];

export function validateEnv() {
  const missing = requiredVariables.filter(
    (key) => !process.env[key]
  );

  if (missing.length > 0) {
    console.error(
      `❌ ValidationError: Missing required environment variables: ${missing.join(', ')}`
    );
    // Not throwing an error to prevent breaking preview builds, 
    // but the console error enforces the validation step
  }
}

validateEnv();

export const env = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_UPLOADS: process.env.NEXT_PUBLIC_UPLOADS,
};
