class CustomFetchWrapper {
  constructor(config) {
    this.baseURL = config.baseURL
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    }
  }

  serializeParams(params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (typeof value === 'object') {
        searchParams.append(key, JSON.stringify(value))
      } else {
        searchParams.append(key, String(value))
      }
    })
    return searchParams.toString()
  }

  async request(config) {
    const { url, method, params, data, headers } = config

    let fullURL = `${this.baseURL}${url}`
    if (params) {
      fullURL += `?${this.serializeParams(params)}`
    }

    const response = await fetch(fullURL, {
      method,
      headers: { ...this.headers, ...headers },
      body: data ? JSON.stringify(data) : undefined,
    })

    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }

    return response.json()
  }

  get(url, config = {}) {
    return this.request({ url, method: 'GET', ...config })
  }

  post(url, data, config = {}) {
    return this.request({ url, method: 'POST', data, ...config })
  }
}

const apiService = new CustomFetchWrapper({
  baseURL: import.meta.env.VITE_API_PREFIX || '',
  headers: { 'Content-Type': 'application/json' },
})

export const request = (config) => {
  return apiService.request(config)
}

export default apiService
