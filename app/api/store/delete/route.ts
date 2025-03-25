import { NextRequest, NextResponse } from "next/server";
import { Client } from "@langchain/langgraph-sdk";
import { LANGGRAPH_API_URL } from "@/app/contants";
//import { verifyUserAuthenticated } from "../../../../lib/supabase/verify_user_server";

export async function POST(req: NextRequest) {
  // try {
  //   const authRes = await verifyUserAuthenticated();
  //   if (!authRes?.user) {
  //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //   }
  // } catch (e) {
  //   console.error("Failed to fetch user", e);
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const { namespace, key } = await req.json();

  const lgClient = new Client({
    apiKey: process.env.LANGCHAIN_API_KEY,
    apiUrl: LANGGRAPH_API_URL,
  });

  try {
    await lgClient.store.deleteItem(namespace, key);

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (_) {
    return new NextResponse(
      JSON.stringify({ error: "Failed to share run after multiple attempts." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
