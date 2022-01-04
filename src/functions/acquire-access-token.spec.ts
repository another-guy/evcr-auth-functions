import fetch, { Response } from 'node-fetch';
import { IAccessTokenResponse } from '.';
import { acquireAccessToken } from './acquire-access-token';

jest.mock('node-fetch');

describe(acquireAccessToken.name, () => {
  let mockFetch: jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    mockFetch = fetch as jest.MockedFunction<typeof fetch>;
  });

  it(`should execute a proper POST request to /oauth2/token endpoint and relay back the AccessTokenResponse`, async () => {
    const idpServiceInfo = { baseUrl: 'https://my-idp.com' };
    const clientInfo = { clientId: 'my-client-id', clientAssertion: 'fake.jwt.token' };
    const mockResponse: IAccessTokenResponse = {
      tokenType: 'Bearer',
      accessToken: 'FAKE.ACCESS.TOKEN',
    };
    mockFetch.mockResolvedValue({ status: 200, ok: true, json: () => Promise.resolve(mockResponse) } as Response);

    const response = await acquireAccessToken(idpServiceInfo, clientInfo);

    expect(mockFetch.mock.calls)
      .toEqual([
        [
          `${idpServiceInfo.baseUrl}/oauth2/token`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ grantType: 'client_credentials', clientId: clientInfo.clientId, clientAssertion: clientInfo.clientAssertion }),
          },
        ],
      ]);
    expect(response).toEqual(mockResponse);
  });

  it('should throw an `Error` if the request status code is not 200 OK', async () => {
    const idpServiceInfo = { baseUrl: 'https://my-idp.com' };
    const clientInfo = { clientId: 'my-client-id', clientAssertion: 'fake.jwt.token' };
    mockFetch.mockResolvedValue({ status: 400, statusText: 'Bad Request', ok: false } as Response);

    expect(() => acquireAccessToken(idpServiceInfo, clientInfo))
      .rejects
      .toThrow(`400 Bad Request
undefined
`);
  });
});
