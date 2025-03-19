"use client";

import TermsOfUse from "@/components/terms-of-use";
import { Suspense } from "react";

export default function Terms() {
  return (
    <Suspense fallback={"loading"}>
      <TermsOfUse />
    </Suspense>
  );
}
