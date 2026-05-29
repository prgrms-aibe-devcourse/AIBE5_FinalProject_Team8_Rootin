import { request } from './client.js';

export function getMe() {
  return request('/api/v1/users/me');
}
