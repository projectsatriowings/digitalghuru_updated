import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Razorpay from "razorpay";
import pool from "@/lib/db";
import { getPlatformSettings } from "@/lib/settings";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const settings = await getPlatformSettings();
    const razorpay = new Razorpay({
      key_id: settings.razorpay_key_id || process.env.RAZORPAY_KEY_ID || "test_key",
      key_secret: settings.razorpay_key_secret || process.env.RAZORPAY_KEY_SECRET || "test_secret",
    });

    // Fetch the course price
    const courseRes = await pool.query(`SELECT id, price FROM courses WHERE id = $1`, [courseId]);
    if (courseRes.rows.length === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const course = courseRes.rows[0];
    const amountInPaise = Math.round(parseFloat(course.price) * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_course_${courseId}_user_${session.user.id}`,
    };

    const order = await razorpay.orders.create(options);

    const keyId = settings.razorpay_key_id || process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    return NextResponse.json({ 
      orderId: order.id, 
      amount: order.amount, 
      currency: order.currency,
      keyId: keyId 
    });
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
