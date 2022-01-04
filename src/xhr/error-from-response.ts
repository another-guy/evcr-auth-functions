import { Response } from 'node-fetch';

export function errorFromResponse(response: Response): Error {
  return new Error(`
${response.status} ${response.statusText}
${JSON.stringify(response.body)}
`);
}
