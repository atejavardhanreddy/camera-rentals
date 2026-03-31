import { NextResponse } from 'next/server';

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/** Respond to CORS preflight OPTIONS requests */
export function corsOptions() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/** Wrap a JSON response with CORS headers */
export function corsJson(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      ...CORS_HEADERS,
      ...(init?.headers ?? {}),
    },
  });
}

/** Respond with a CORS-enabled error */
export function corsError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: CORS_HEADERS });
}
