/**
 * GET /api/health
 * Lightweight health endpoint — verifies MongoDB connectivity.
 * Returns 200 on success, 503 on failure.
 * Never exposes credentials or internal stack traces to clients.
 */

import { NextResponse } from 'next/server';
import { pingDatabase } from '@/lib/db/mongo';


export async function GET() {
  try {
    const result = await pingDatabase();
    return NextResponse.json(
      {
        status: result.ok ? 'ok' : 'degraded',
        db: {
          connected: result.ok,
          name: result.dbName,
          latencyMs: result.latencyMs,
          connectedAt: result.connectedAt,
        },
        serverTime: new Date().toISOString(),
      },
      { status: result.ok ? 200 : 503 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Database health check failed',
      },
      { status: 503 }
    );
  }
}
