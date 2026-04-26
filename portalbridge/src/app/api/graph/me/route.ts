import { NextResponse } from "next/server";
import { bearerFromHeader, exchangeForGraphToken } from "@/auth/server-graph";

// Demo BFF route. The SPA could call /me directly with msal-browser; this
// route exists to show the on-behalf-of pattern end-to-end. Replicate this
// shape for any future server-side Graph call (audit logging, write actions).
export async function GET(req: Request) {
  const userToken = bearerFromHeader(req.headers.get("authorization"));
  if (!userToken) {
    return NextResponse.json({ error: "missing_bearer" }, { status: 401 });
  }

  try {
    const graphToken = await exchangeForGraphToken(userToken, [
      "https://graph.microsoft.com/User.Read",
    ]);

    const res = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${graphToken}` },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "graph_error", status: res.status, body: await res.text() },
        { status: 502 },
      );
    }

    // TODO(phase 2): write to audit log table here.
    return NextResponse.json(await res.json());
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json({ error: "obo_failed", message }, { status: 500 });
  }
}
