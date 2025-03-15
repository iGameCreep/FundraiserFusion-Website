const axios = require("axios");
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type"
};

const ENV = {
  STREAMLABS_REDIRECT_URI: `${process.env['APP_DOMAIN']}/auth`,
  STREAMLABS_APP_URL: process.env['STREAMLABS_APP_URL'],
  STREAMLABS_APP_ID: process.env['STREAMLABS_APP_ID'],
  STREAMLABS_APP_SECRET: process.env['STREAMLABS_APP_SECRET'],
  STREAMLABS_APP_SCOPES: ['donations.read'],
}

const streamlabs_app_url = new URL(ENV.STREAMLABS_APP_URL);
streamlabs_app_url.searchParams.set('response_type', 'code');
streamlabs_app_url.searchParams.set('client_id', ENV.STREAMLABS_APP_ID);
streamlabs_app_url.searchParams.set('redirect_uri', ENV.STREAMLABS_REDIRECT_URI);
streamlabs_app_url.searchParams.set('scope', ENV.STREAMLABS_APP_SCOPES.join('+'));

exports.handler = async (event, context) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: headers,
    };
  }

  if (event.httpMethod === "GET") {
    return {
      statusCode: 302,
      headers: {
        Location: streamlabs_app_url,
        'Cache-Control': 'no-cache',
      },
      body: 'Redirecting...',
    };
  }

  if (event.httpMethod === "POST") {
    try {
      const code = event.queryStringParameters['code'];
      if (!code) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: false,
            message: "No code provided",
          }),
        };
      }

      const body = {
        grant_type: 'authorization_code',
        client_id: ENV.STREAMLABS_APP_ID,
        client_secret: ENV.STREAMLABS_APP_SECRET,
        redirect_uri: ENV.STREAMLABS_REDIRECT_URI,
        code: code
      }

      const res = await axios.post(`https://streamlabs.com/api/v2.0/token`, body, {headers});
      const data = res.data;
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({
          success: true,
          data: {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_in: data.expires_in,
          }
        })
      }
    } catch (error) {
      return {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({
          success: false,
          message: "An error occured during the token fetching.",
          debug: error,
        }),
      };
    }
  }

  return {
    statusCode: 400,
    headers: headers,
    body: JSON.stringify({
      success: false,
      message: "Method not allowed",
    }),
  };
}
