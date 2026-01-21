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
  // Default based on environment
  if (import.meta.env.DEV) {
    return 'http://localhost:8787'
  }
  // Production - must be set in environment variables
  return ''
}

