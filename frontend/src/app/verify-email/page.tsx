"use client";

import { _axios } from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyEmailContent({ error }: { error?: string }) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  console.log(token);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["verify-email"],
    queryFn: async () => {
      const res = await _axios.get(`/form/verify-email?token=${token}`);
      return res.data;
    },
  });

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-6'>
      <div className='max-w-md w-full bg-white rounded-xl shadow-lg p-8 transform transition-all duration-500 hover:shadow-xl'>
        {error ? (
          <div className='space-y-4'>
            <div className='flex justify-center'>
              <div className='h-20 w-20 rounded-full bg-red-100 flex items-center justify-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-10 w-10 text-red-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </div>
            </div>
            <h2 className='text-2xl font-bold text-gray-800 text-center'>
              Verification Failed
            </h2>
            <p className='text-red-600 text-center'>{error}</p>
            <button className='mt-4 w-full py-3 bg-buttoncol hover:bg-buttoncol text-white font-medium rounded-lg transition-colors duration-300'>
              Try Again
            </button>
          </div>
        ) : (
          <div className='space-y-6'>
            <div className='flex justify-center'>
              <div className='h-20 w-20 rounded-full bg-green-100 flex items-center justify-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-10 w-10 text-green-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
            </div>
            <h2 className='text-3xl font-bold text-gray-800 text-center'>
              Email Verified!
            </h2>
            <p className='text-gray-600 text-center'>
              Your account has been successfully verified.
            </p>
            <button className='mt-6 w-full py-3 bg-buttoncol hover:bg-buttoncol text-white font-medium rounded-lg transition-colors duration-300'>
              Continue with Apriso
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmail({ error }: { error?: string }) {
  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-6'>
          <div className='max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center'>
            <div className='animate-pulse'>
              <div className='flex justify-center mb-6'>
                <div className='h-20 w-20 rounded-full bg-gray-200'></div>
              </div>
              <div className='h-8 bg-gray-200 rounded mb-4'></div>
              <div className='h-4 bg-gray-200 rounded mb-6'></div>
              <div className='h-12 bg-gray-200 rounded'></div>
            </div>
          </div>
        </div>
      }>
      <VerifyEmailContent error={error} />
    </Suspense>
  );
}
