import Image from "next/image";
import paymentsuccess from "../../../public/images/paymentsuccess.png";

export default function PaymentSuccess() {
  return (
    <main className='h-screen w-screen sticky  flex flex-col items-center justify-center container mx-auto'>
      <div className=''>
        <Image
          loading='eager'
          src={paymentsuccess}
          alt='Payment Image'
          className='object-contain h-[300px] w-[300px]'
        />
      </div>
    </main>
  );
}
