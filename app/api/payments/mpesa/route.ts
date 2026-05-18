import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_E2PAYMENTS_BASE_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_E2PAYMENTS_CLIENT_ID;
const CLIENT_SECRET = process.env.E2PAYMENTS_CLIENT_SECRET;

if (!BASE_URL || !CLIENT_ID || !CLIENT_SECRET) {
  throw new Error("M-Pesa environment variables not configured");
}

// Initiate M-Pesa payment
export async function POST(request: NextRequest) {
  try {
    const { saleId, phoneNumber, amount } = await request.json();

    if (!saleId || !phoneNumber || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create payment record
    const paymentRecord = await db
      .insert(payments)
      .values({
        saleId,
        phoneNumber,
        amount: amount.toString(),
        status: "pending",
        paymentMethod: "mpesa",
      })
      .returning();

    const payment = paymentRecord[0];

    // Call E2Payments API
    const e2paymentsResponse = await fetch(`${BASE_URL}/api/v1/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLIENT_ID}:${CLIENT_SECRET}`,
      },
      body: JSON.stringify({
        externalId: payment.id,
        amount: Number(amount),
        currency: "MZN",
        phoneNumber: phoneNumber.replace(/\D/g, ""), // Remove non-digits
        narration: `Sale Payment - ${saleId}`,
        callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payments/mpesa/callback`,
      }),
    });

    if (!e2paymentsResponse.ok) {
      const errorData = await e2paymentsResponse.json();
      await db
        .update(payments)
        .set({
          status: "failed",
          errorMessage: errorData.message || "Payment initiation failed",
        })
        .where(eq(payments.id, payment.id));

      return NextResponse.json(
        { error: errorData.message || "Payment initiation failed" },
        { status: e2paymentsResponse.status }
      );
    }

    const responseData = await e2paymentsResponse.json();

    // Update payment with transaction ID
    await db
      .update(payments)
      .set({
        transactionId: responseData.transactionId || responseData.id,
        status: "processing",
      })
      .where(eq(payments.id, payment.id));

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      transactionId: responseData.transactionId || responseData.id,
      message: "Payment initiated. Please check your phone for the prompt.",
    });
  } catch (error) {
    console.error("M-Pesa payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Check payment status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("paymentId");

    if (!paymentId) {
      return NextResponse.json(
        { error: "Missing paymentId parameter" },
        { status: 400 }
      );
    }

    const payment = await db.query.payments.findFirst({
      where: eq(payments.id, paymentId),
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      phoneNumber: payment.phoneNumber,
      transactionId: payment.transactionId,
      errorMessage: payment.errorMessage,
    });
  } catch (error) {
    console.error("Payment status check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
