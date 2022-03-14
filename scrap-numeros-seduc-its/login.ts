function login() {
  const creds = {
    username: env.SPSPCreds().username,
    password: env.SPSPCreds().password,
  };

  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: 'post',
    followRedirects: false,
    payload: creds,
  };

  const res = UrlFetchApp.fetch(
    'https://www.documentos.spsempapel.sp.gov.br/siga/public/app/login',
    options,
  );

  const authCookie = res
    .getHeaders()
    ['Set-Cookie'].split(';')
    .find((c: string) => c.includes('siga-jwt-auth'));

  return authCookie;
}
