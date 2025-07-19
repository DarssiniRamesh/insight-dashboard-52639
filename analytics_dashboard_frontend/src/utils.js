// Utility to extract integrations from array of apps.
// Ensures .forEach is only called on valid arrays.
/**
 * PUBLIC_INTERFACE
 * Extracts flat list of integrations from all apps. Always returns [] if input malformed.
 * @param {Array} apps
 * @returns {Array} Integrations or []
 */
export function extractIntegrationsFromApps(apps) {
  if (!Array.isArray(apps)) return [];
  const integrations = [];
  apps.forEach((app) => {
    if (app && Array.isArray(app.integrations)) {
      app.integrations.forEach((i) => integrations.push(i));
    }
  });
  return integrations;
}

// -- existing utils can be placed below, or above as needed, unchanged --
