import { sleep } from 'k6';
import http from 'k6/http';

export const options = {
  duration: '30s',
  vus: 10,
};

export default function () {
  const query = `
    query HealthCheck {
      healthCheck
    }`;
  const headers = {
    'Content-Type': 'application/json',
  };
  http.post('http://localhost:3000/graphql/test', JSON.stringify({ query }), { headers });
  sleep(1);
}
