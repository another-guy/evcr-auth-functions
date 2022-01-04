import fetch, { Response } from 'node-fetch';
import { errorFromResponse } from '../xhr/error-from-response';

export interface IAccessTokenResponse {
  tokenType: string;
  accessToken: string;
}

export async function acquireAccessToken(
  idpServiceInfo: {
    baseUrl: string;
  },
  clientInfo: {
    clientId: string;
    clientAssertion: string;
  }
): Promise<IAccessTokenResponse> {
  const { baseUrl } = idpServiceInfo;
  const { clientId, clientAssertion } = clientInfo;

  const accessTokenIssueEndpoint = `${baseUrl}/oauth2/token`;

  const payload = {
    'grantType': 'client_credentials',
    clientId,
    clientAssertion,
  };

  const response: Response = await fetch(
    accessTokenIssueEndpoint,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) throw errorFromResponse(response);

  const accessTokenResponse = await response.json() as IAccessTokenResponse;
  return accessTokenResponse;
}
