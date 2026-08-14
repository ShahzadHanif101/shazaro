import { NextResponse } from "next/server";

// =====================================================
// SHAZARO XMLTV — GENERATE EMPTY EPG
// =====================================================

function generateEmptyEPG(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<tv generator-info-name="SHAZARO IPTV">
  <!-- No EPG data available -->
</tv>`;
}

// =====================================================
// SHAZARO XMLTV — MAIN ROUTE
// =====================================================

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const { searchParams } = url;

    const username = searchParams.get("username") ?? "";
    const password = searchParams.get("password") ?? "";

    // Log the request
    console.log(`[XMLTV] Request from: ${username}`);

    // =====================================================
    // ✅ RETURN EMPTY EPG (XML Format)
    // =====================================================

    const epgXml = generateEmptyEPG();

    return new NextResponse(epgXml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });

  } catch (error) {
    console.error("[SHAZARO XMLTV] Failed:", error);
    
    // Even on error, return empty EPG
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>\n<tv generator-info-name="SHAZARO IPTV">\n  <!-- EPG Error -->\n</tv>`,
      {
        status: 200,
        headers: {
          "Content-Type": "application/xml",
        },
      },
    );
  }
}