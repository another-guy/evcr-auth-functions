import { Response } from 'node-fetch';
import { errorFromResponse } from './error-from-response';

describe(errorFromResponse.name, () => {
  it(`generates error with the expected message based on the response object provided`, () => {
    const response = {
      status: 400,
      statusText: 'Bad Request',
      body: 'Description of the bad request.'
    } as unknown as Response;

    const expectedError = new Error(`
${400} ${'Bad Request'}
${JSON.stringify("Description of the bad request.")}
`);

    expect(errorFromResponse(response)).toEqual(expectedError);
  });
});
