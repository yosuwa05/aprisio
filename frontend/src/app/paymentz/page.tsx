import { PaymentSuccess } from "@/components/paymentz";
import { Suspense } from "react";

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccess />
    </Suspense>
  );
}
