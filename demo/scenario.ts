
import authFunctions, { IKeyPair } from '../src';

async function getClientKeyPair(): Promise<IKeyPair> {
  return Promise.resolve({
    id: 'key-id',
    privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCT5OgGWF8Rde0g
342YbqOBApk94lX4GPwvw1ECx1C2m46owpdn2U6EZKdF5op844b5KTg7r2C5dqSZ
FH6Cs7/tuFpKMECGvYcSw5OjHb4Onft85QEbyoXvZ3cvGfc9jyZFmoO+oqZ2Tmnk
Ttzb0Fo2IgVgfhCE0VQMGOpQDqGRq2JEAINXBLIihv1zgmC904iV6+eK4l896pFK
1C3OaGJt8vOtTl6Nvvu5s9ASuI5AGTEsuNfRHp5AIe8AAR7yGVc1i5px4z2nzMd2
iw61hxX4ebgDL2mKQlZ+jEmExhOym3XeFWpR7gLBsebt1CjDK7DPVxctHqcKqJsm
lSfgGuTzAgMBAAECggEAAdI0xTc7XHSuSdRW4wShwMnuZyOtWVO9bz0hdz5LESST
OiLDSIUVgW3X3XV8SRNoKxNF3P5I25/JYRUuhZ9/AoddnUJA2SfmTOXZoI2SNI3f
dec//z6cLZmBjzPrpndnyj2f164bDKPki+oosBA9vCLpHAoRXAFT3p5D7F5xwOBt
l3/y6h8kPc8WLPZRIb2nhdLdMRLmIchJovcWId44pjIuaXmpxItGzI1U/zF2LAyA
BR+WmYQ5NGdy/4gSpyTHphW6+Uuu6SDrPI8Er0F0zbUwetR0aHSLAINUDJDJc867
Vfcg7Sbnrox9nJcW/QkMgjNX+3CkgyNLYPFXIkyPwQKBgQDE0r+liwS8inpJyFYM
jrxfzhjaM3blWzYFYu5TM0yHr33DM/MKj3lyQrgI4MPiIroMPoORcQ6PTeY3k3mg
U8Dd+hj0kz2iP9oA5NDRDztIFOBuaYVasFVbB+t17Uu3KnVm+hKVtti99c/x085g
kqV3a8nFTGtwU0FAIheR7lCcIQKBgQDAXCUi7ezPivB5SK1oyQMXLnt+SwTyiCnJ
Xf4/0JuIIh62ImnX5I/50QicNAfoObVoTS6zd5frN9CvLqXjvpCwJ6jf6dvJdphA
O1yVHdhQ2cRe2SFCRSm+id/GnoJJT06eDg33uoqxxxHOsR21HcvXSZYk5odzsXAS
7rDzo9l+kwKBgQCazIYeVPAsuVzkmsPSrJBLaXTyaHeie9JI+j4nAbm3Hbbzx+/m
5mDGFONZWC23tUhOSPyBb0HcQ5BFNZ/7EOQnsYPfF87pxP5YpZ32Ttx5HLJHJIbV
hModBmWSIkfij2o2y4fCaESfYq1hrQwruCqbehL/MdNuTIyNPEL9a0nLAQKBgDL1
tljkk0IAWuimmloSNqFjjQ/OLAdcj0VrgznAuBN+hohV4ZhyUrop6JAJMLcS4r45
BFBDNJn59W0TfJszFv2z5Ac92x4qLveFQme2umHg7yb5etglnoN93yytPXLScc9p
hcXFQ40JYexR+77JoADu27n24JeDwF8joPlKxQnFAoGBALJXgBt/PARKqMpU+KTQ
on5Zn06oGXqH1lgBdiN0qEtE7DUmXGd7jP+h4O7n3VchzSK577e0EtnDJYhuE2sW
x+PzoWwg9rMdofDLINjHMW6uk90PAaTbJQtuI1lU669ptIcMmfRb2tBXHkrKn6+b
oKSuHQoTqKNUnHDVGl1IrnJq
-----END PRIVATE KEY-----`,
    publicKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAk+ToBlhfEXXtIN+NmG6j
gQKZPeJV+Bj8L8NRAsdQtpuOqMKXZ9lOhGSnReaKfOOG+Sk4O69guXakmRR+grO/
7bhaSjBAhr2HEsOTox2+Dp37fOUBG8qF72d3Lxn3PY8mRZqDvqKmdk5p5E7c29Ba
NiIFYH4QhNFUDBjqUA6hkatiRACDVwSyIob9c4JgvdOIlevniuJfPeqRStQtzmhi
bfLzrU5ejb77ubPQEriOQBkxLLjX0R6eQCHvAAEe8hlXNYuaceM9p8zHdosOtYcV
+Hm4Ay9pikJWfoxJhMYTspt13hVqUe4CwbHm7dQowyuwz1cXLR6nCqibJpUn4Brk
8wIDAQAB
-----END PUBLIC KEY-----`,
  });
}

async function getAccessTokenDemo() {
  const keyPair = await getClientKeyPair();
  const somePayload = {
    abc: 123,
  };

  console.info(`Using private key from
${JSON.stringify(keyPair, null, 2)}
to create JWT with payload
${JSON.stringify(somePayload, null, 2)}
`);

  const clientAssertion = await authFunctions.generateJwt(keyPair, somePayload);

  console.info(`Generated token ${clientAssertion}\n`);

  const idpServiceInfo = { baseUrl: 'http://localhost:8025' };
  const clientInfo = {
    clientId: 'test-application-client-id',
    clientAssertion,
  };

  console.info(`Sending client info
${JSON.stringify(clientInfo)}
to
${idpServiceInfo.baseUrl}
to acquire access token.
`);

  const accessTokenResponse = await authFunctions.acquireAccessToken(
    idpServiceInfo,
    clientInfo,
  );

  console.info(`Generated access token:\n
${JSON.stringify(accessTokenResponse, null, 2)}
`);

  const validatedToken = await authFunctions.validateAccessTokenUsingJWKS(
    { jwksEndpoint: 'http://localhost:8025/oauth2/jwks' },
    { accessTokenToValidate: accessTokenResponse.accessToken },
  );
  console.info({ validatedToken });
}

getAccessTokenDemo().then(() => { });
