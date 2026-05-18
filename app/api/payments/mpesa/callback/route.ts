import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // E2Payments callback structure
    const {
      externalId,
      transactionId,
      status,
      amount,
      phoneNumber,
      errorMessage,
    } = body;

    if (!externalId || !transactionId) {
      return NextResponse.json(
        { error: "Missing required callback parameters" },
        { status: 400 }
      );
    }

    // Update payment status based on E2Payments response
    const paymentStatus =
      status === "completed" || status === "success"
        ? "completed"
        : status === "failed" || status === "error"
          ? "failed"
          : "processing";

    await db
      .update(payments)
      .set({
        status: paymentStatus,
        transactionId: transactionId,
        errorMessage: errorMessage || null,
      })
      .where(eq(payments.id, externalId));

    // Return success to E2Payments
    return NextResponse.json({ success: true, message: "Callback processed" });
  } catch (error) {
    console.error("M-Pesa callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
