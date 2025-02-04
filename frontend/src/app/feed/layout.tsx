"use client";

import { _axios } from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const res = await _axios.get(`/validate`);
      return res.data;
    },
    queryKey: ["validate user"],
  });

  return <div>{children}</div>;
}
