const API_BASE = '/api';

async function request(method, path, data = null, isFormData = false) {
  const token = localStorage.getItem('wemaone_token');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const config = { method, headers };
  if (data) {
    config.body = isFormData ? data : JSON.stringify(data);
  }

  const res = await fetch(`${API_BASE}${path}`, config);
  const json = await res.json();
  if (!res.ok) throw { status: res.status, ...json };
  return json;
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, data) => request('POST', path, data),
  put: (path, data) => request('PUT', path, data),
  delete: (path) => request('DELETE', path),
  upload: (path, formData) => request('POST', path, formData, true),
};
