import { request } from './client.js';

export async function generateSummary(potId) {
  return request('/api/v1/ai/summary', { method: 'POST', body: JSON.stringify({ potId }) });
}

export async function generateQuiz(potId, count) {
  return request('/api/v1/ai/quiz', { method: 'POST', body: JSON.stringify({ potId, count }) });
}

export async function saveResult(type, potId, content) {
  return request('/api/v1/ai/results', {
    method: 'POST',
    body: JSON.stringify({ type, potId, content: JSON.stringify(content) }),
  });
}

export async function fetchResults() {
  return request('/api/v1/ai/results');
}

export async function deleteResult(resultId) {
  return request(`/api/v1/ai/results/${resultId}`, { method: 'DELETE' });
}
