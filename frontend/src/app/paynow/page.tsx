"use client";

import { Button } from "@/components/ui/button";
import { _axios } from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";

export default function PayNowPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["paynow"],
    queryFn: async () => {
      const res = await _axios.get("/payment/generateHash");
      return res.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <p>Pay now for your order.</p>

      {JSON.stringify(data, null, 2)}

      <form
        id="payuForm"
        action="https://secure.payu.in/_payment"
        method="post"
      >
        <input type="hidden" name="key" value={data?.key || ""} />
        <input type="hidden" name="txnid" value={data?.uniqueId || ""} />
        <input type="hidden" name="amount" value={"1"} />
        <input type="hidden" name="productinfo" value={"iPhone"} />
        <input type="hidden" name="firstname" value={"Ashish"} />
        <input type="hidden" name="email" value={"test@gmail.com"} />
        <input type="hidden" name="phone" value={"1234567890"} />
        <input
          type="hidden"
          name="surl"
          value={"https://example.com/success"}
        />
        <input
          type="hidden"
          name="furl"
          value={"https://example.com/failure"}
        />
        <input type="hidden" name="hash" value={data?.hash || ""} />

        <Button type="submit">Pay Now</Button>
      </form>
    </div>
  );
}
