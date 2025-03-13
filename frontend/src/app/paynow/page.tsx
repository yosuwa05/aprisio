// "use client";

// import { Button } from "@/components/ui/button";
// import { _axios } from "@/lib/axios-instance";
// import { useQuery } from "@tanstack/react-query";

// export default function PayNowPage() {
//   const { data, isLoading } = useQuery({
//     queryKey: ["paynow"],
//     queryFn: async () => {
//       const res = await _axios.get("/payment/generateHash");
//       return res.data;
//     },
//   });

//   if (isLoading) return <div>Loading...</div>;

//   return (
//     <div>
//       <p>Pay now for your order.</p>

//       {JSON.stringify(data, null, 2)}

//     </div>
//   );
// }
