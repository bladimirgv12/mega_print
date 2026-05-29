/* =============================================
   MegaPrint — api.js
   Central module for all API calls
   ============================================= */

const API_CONFIG = {
  baseURL: 'http://localhost:8000/api',
  timeout: 15000,
};

// ── Token Management ──
const Auth = {
  getToken: () => localStorage.getItem('megaprint_token'),
  setToken: (token) => localStorage.setItem('megaprint_token', token),
  removeToken: () => localStorage.removeItem('megaprint_token'),
  isLoggedIn: () => !!localStorage.getItem('megaprint_token'),
  getUser: () => {
    const u = localStorage.getItem('megaprint_user');
    return u ? JSON.parse(u) : null;
  },
  setUser: (user) => localStorage.setItem('megaprint_user', JSON.stringify(user)),
  removeUser: () => localStorage.removeItem('megaprint_user'),
  logout: () => {
    localStorage.removeItem('megaprint_token');
    localStorage.removeItem('megaprint_user');
  },
};

// ── Base Fetch ──
async function apiFetch(endpoint, options = {}) {
  const token = Auth.getToken();
  const url = `${API_CONFIG.baseURL}${endpoint}`;

  const defaultHeaders = {
    'Accept': 'application/json',
  };

  // Only set Content-Type if not FormData
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
    config.signal = controller.signal;

    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    // Handle 401 (expired token)
    if (response.status === 401) {
      Auth.logout();
      if (window.location.pathname.includes('admin')) {
        window.location.href = 'admin.html';
      }
      throw new Error('Sesión expirada. Por favor inicia sesión de nuevo.');
    }

    const data = await response.json();

    if (!response.ok) {
      const msg = data.message || data.error || `Error ${response.status}`;
      throw new Error(msg);
    }

    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('La solicitud tardó demasiado. Verifica tu conexión.');
    }
    throw err;
  }
}

// ── API Modules ──

// Products
const ProductsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/products${query ? '?' + query : ''}`);
  },
  getById: (id) => apiFetch(`/products/${id}`),
  create: (formData) => apiFetch('/products', { method: 'POST', body: formData }),
  update: (id, formData) => {
    formData.append('_method', 'PUT');
    return apiFetch(`/products/${id}`, { method: 'POST', body: formData });
  },
  delete: (id) => apiFetch(`/products/${id}`, { method: 'DELETE' }),
};

// Categories
const CategoriesAPI = {
  getAll: () => apiFetch('/categories'),
  create: (data) => apiFetch('/categories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/categories/${id}`, { method: 'DELETE' }),
};

// Jobs
const JobsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/jobs${query ? '?' + query : ''}`);
  },
  getById: (id) => apiFetch(`/jobs/${id}`),
  create: (formData) => apiFetch('/jobs', { method: 'POST', body: formData }),
  update: (id, formData) => {
    formData.append('_method', 'PUT');
    return apiFetch(`/jobs/${id}`, { method: 'POST', body: formData });
  },
  delete: (id) => apiFetch(`/jobs/${id}`, { method: 'DELETE' }),
};

// Testimonials
const TestimonialsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/testimonials${query ? '?' + query : ''}`);
  },
  create: (formData) => apiFetch('/testimonials', { method: 'POST', body: formData }),
  approve: (id) => apiFetch(`/testimonials/${id}/approve`, { method: 'PUT' }),
  delete: (id) => apiFetch(`/testimonials/${id}`, { method: 'DELETE' }),
};

// About
const AboutAPI = {
  getAll: () => apiFetch('/about'),
  create: (formData) => apiFetch('/about', { method: 'POST', body: formData }),
  update: (id, formData) => {
    formData.append('_method', 'PUT');
    return apiFetch(`/about/${id}`, { method: 'POST', body: formData });
  },
  delete: (id) => apiFetch(`/about/${id}`, { method: 'DELETE' }),
};

// Contacts
const ContactsAPI = {
  send: (data) => apiFetch('/contacts', { method: 'POST', body: JSON.stringify(data) }),
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/contacts${query ? '?' + query : ''}`);
  },
  delete: (id) => apiFetch(`/contacts/${id}`, { method: 'DELETE' }),
};

// Auth
const AuthAPI = {
  login: (credentials) => apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  logout: () => apiFetch('/auth/logout', { method: 'POST' }),
  me: () => apiFetch('/auth/me'),
};

// ── Image URL Helper ──
function getImageUrl(path) {
  if (!path) return 'assets/images/placeholder.jpg';
  if (path.startsWith('http')) return path;
  return `${API_CONFIG.baseURL.replace('/api', '')}/storage/${path}`;
}

// Export for module use or attach to window
window.API = {
  Auth: {
  ...Auth,
  ...AuthAPI,
},
  Products: ProductsAPI,
  Categories: CategoriesAPI,
  Jobs: JobsAPI,
  Testimonials: TestimonialsAPI,
  About: AboutAPI,
  Contacts: ContactsAPI,
  getImageUrl,
  baseURL: API_CONFIG.baseURL,
};
