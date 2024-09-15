import { NextRequest, NextResponse } from "next/server";

// POST request handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code } = body;

    if (typeof code !== "string") {
      return NextResponse.json(
        { message: "Invalid code format" },
        { status: 400 }
      );
    }

    console.log("Received code:", code);

    // Perform your logic here
    return NextResponse.json({ message: "Code received successfully", code });
  } catch (error) {
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

