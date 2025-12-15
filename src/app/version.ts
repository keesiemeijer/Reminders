// Version of the app
// Todo: Get this from package.json during the build process.
export const APP_VERSION = "1.0.0";

// Up the schema number if you want to make changes to the app settings (schema) structure.
// The upgrade routine (in ../utils/upgrate.ts) will run if the stored version is lower than this number.
// In the upgrade routine you can update the stored settings to pass all the (newer) validation checks.

export const APP_SCHEMA_VERSION = 1;
