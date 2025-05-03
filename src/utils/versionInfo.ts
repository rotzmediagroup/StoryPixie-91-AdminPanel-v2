
/**
 * Application version information
 * Update this file when releasing new versions
 */

export const APP_VERSION = '1.1.0';

/**
 * Returns the current application version
 */
export const getAppVersion = (): string => {
  return APP_VERSION;
};

/**
 * Checks if current version is newer than the provided version
 * @param compareVersion - Version to compare against current version
 */
export const isNewerVersion = (compareVersion: string): boolean => {
  const current = APP_VERSION.split('.').map(Number);
  const compare = compareVersion.split('.').map(Number);
  
  for (let i = 0; i < current.length; i++) {
    if (current[i] > compare[i]) return true;
    if (current[i] < compare[i]) return false;
  }
  
  return false;
};
