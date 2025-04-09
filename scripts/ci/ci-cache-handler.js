/**
 * CI-specific cache handler for Next.js builds
 * 
 * This simple in-memory cache handler helps speed up CI builds by caching
 * results in memory for the duration of the build process.
 * 
 * For production or development, the default Next.js caching mechanism is better.
 */

const cache = new Map();

module.exports = {
  get: async (key) => {
    return { value: cache.get(key) };
  },
  set: async (key, data) => {
    cache.set(key, data);
    return true;
  },
  revalidateTag: async () => {
    // No-op in CI
    return true;
  }
}; 