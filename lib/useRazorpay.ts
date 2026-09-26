"use client";

import { useCallback } from "react";

export function useRazorpay() {
  const loadScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const processPayment = useCallback(
    async (
      courseId: number, 
      courseTitle: string,
      user: { name: string; email: string; contact?: string; upi_id?: string },
      onSuccess: () => void,
      onError: (err: any) => void
    ) => {
      try {
        const res = await loadScript();
        if (!res) {
          onError(new Error("Razorpay SDK failed to load. Are you online?"));
          return;
        }

        // 1. Create Order on Backend
        const result = await fetch("/api/payments/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId }),
        });

        if (!result.ok) {
          const errData = await result.json();
          throw new Error(errData.error || "Failed to create order");
        }

        const { orderId, amount, currency, keyId } = await result.json();

        // 2. Setup Razorpay options
        const options: any = {
          key: keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "test_key", 
          amount: amount.toString(),
          currency: currency,
          name: "Digital Ghuru",
          description: `Enrollment for ${courseTitle}`,
          order_id: orderId,
          handler: async function (response: any) {
            try {
              // 3. Verify Payment Signature
              const verifyRes = await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  courseId: courseId,
                }),
              });

              if (!verifyRes.ok) throw new Error("Payment verification failed");
              
              onSuccess();
            } catch (err) {
              console.error("Verification error:", err);
              onError(err);
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.contact || "9999999999",
          },
          theme: {
            color: "#3399cc",
          },
          modal: {
            ondismiss: function () {
              onError(new Error("Payment cancelled by user."));
            },
          },
        };

        if (user.upi_id) {
          options.prefill.vpa = user.upi_id; 
        }

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.on("payment.failed", function (response: any) {
          onError(new Error(response.error.description));
        });
        paymentObject.open();
      } catch (err) {
        console.error("Payment initiation error:", err);
        onError(err);
      }
    },
    []
  );

  return { processPayment };
}
