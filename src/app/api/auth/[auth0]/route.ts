import { handleAuth, handleCallback,  NextAppRouterHandler } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

function parse(url: string) {
  const params = url.split("?")[1].split("&");
  const queryParams = params.reduce((prev, curr) => {
    const param = curr.split("=");
    return {
      ...prev,
      [param[0]]: param[1]
    }
  }, {});
  return queryParams;
}

const callbackHandler: NextAppRouterHandler = async (req, ctx) => {
  const params = parse(req.url);
  if ("error" in params && params.error === "access_denied")
    return new NextResponse(null, { status: 301, headers: { "Location": "/" }})
  return await handleCallback(req, ctx);
}

export const GET = handleAuth({
  callback: callbackHandler
});