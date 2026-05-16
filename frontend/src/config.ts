// System configuration - centralized access to environment variables

// Get the system display name (e.g., "Bruno Portfolio")
export function getSystemName(): string {
  return import.meta.env.VITE_SYSTEM_NAME || 'Bruno Portfolio'
}

// Get the base URL path (e.g., "" for root or "/portfolio" for subdirectory)
export function getBaseUrl(): string {
  return import.meta.env.BASE_URL || '/'
}

// Get the repository name (e.g., "portfolio")
export function getRepoName(): string {
  return import.meta.env.VITE_REPO_NAME || 'portfolio'
}

// Get the API base URL
export function getApiBaseUrl(): string {
  const apiPrefix = import.meta.env.VITE_API_PREFIX
  if (apiPrefix) {
    return apiPrefix
  }

  // Vite dev server proxies /api to the Worker and avoids CORS in development.
  if (import.meta.env.DEV) {
    return ''
  }

  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host === 'localhost' || host === '127.0.0.1' || host === '::1') {
      return 'http://127.0.0.1:8787'
    }
  }

  // Production uses the same origin. Cloudflare routes /api/* to the Worker.
  return ''
}
