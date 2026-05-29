import { request } from './client.js';

export function getPots() {
  return request('/api/v1/pots');
}
