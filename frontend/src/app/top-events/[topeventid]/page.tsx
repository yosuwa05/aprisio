import { Button } from "@/components/ui/button";
import coffee from "../../../../public/images/coffee.jpg";
import Image from "next/image";
import logosmall from "@img/images/final-logo.png";
export default function ViewTopEventPage() {
  return (
    <main className='px-4 md:px-8 py-4 md:py-6'>
      <div className='flex justify-between items-center flex-wrap gap-4'>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-5'>
            <h1 className='text-3xl md:text-5xl font-medium text-textcol font-roboto'>
              A Coffee Masterclass
            </h1>
            <h2 className='text-xl md:text-2xl text-[#64737A]  font-roboto font-medium'>
              Sun, April 6 2025, 4:00 PM - 6:30 PM
            </h2>
          </div>
          <div className='text-contrasttext text-base font-sans'>
            <h1>Bengaluru</h1>
            <div>Hosted by : Aprisio</div>
          </div>
        </div>
        <div className=''>
          <Button className='bg-[#FCF7EA] hover:bg-[#FCF7EA] border border-gray-300 rounded-3xl text-black'>
            Buy Tickets
          </Button>
        </div>
      </div>
      <div className='text-[#353535CC]/80 font-extrabold font-roboto text-lg py-4'>
        Starts at INR 15000
      </div>

      <div className='flex flex-col lg:flex-row gap-10 pt-6'>
        <div className='w-full lg:w-1/4 flex-shrink-0'>
          <Image
            loading='eager'
            src={coffee}
            alt='Event Image'
            className='w-full h-auto object-cover'
          />

          <div
            style={{ boxShadow: "15px 4px 60px 0px #02507C26" }}
            className='mt-4 w-fullrounded-lg bg-[#FFFFFF] p-6 rounded-lg'>
            <div className='flex gap-4 items-center'>
              <Image
                src={logosmall}
                className='w-[50px] cursor-pointer   '
                alt='logo'
              />
              <div className='flex flex-col gap-1'>
                <span className='text-textcol font-bold text-lg '>About</span>
                <span className='text-fadedtext text-sm'>Aprisio</span>
              </div>
            </div>
            <p className='font-normal text-lg pt-3 leading-8 break-words text-[#353535CC]/80  font-sans text-pretty whitespace-normal '>
              Aprisio is launching India’s first Community platform for older
              adults with an exclusive Coffee Masterclass curated for older
              adults age 40
            </p>
          </div>
        </div>

        <div className='lg:w-2/3'>
          <div>
            <h2 className='text-lg md:text-xl font-semibold font-roboto text-textcol'>
              Your perfect Sunday morning escape!
            </h2>
            <p className='text-[#353535CC]/80 leading-7 md:leading-10 pt-2 text-base md:text-lg font-sans'>
              Grab your coffee, enjoy some delicious breakfast bites, and dive
              into lively discussions about your favorite episodes, plot twists,
              and characters. It’s the perfect spot to chat, laugh, and bond
              over everything K-Drama with Strangers.
            </p>
          </div>
          <div className='pt-3'>
            <h2 className='text-lg md:text-xl font-semibold font-roboto text-textcol'>
              Your perfect Sunday morning escape!
            </h2>
            <p className='text-[#353535CC]/80 leading-7 md:leading-10 pt-2 text-base md:text-lg font-sans'>
              Grab your coffee, enjoy some delicious breakfast bites, and dive
              into lively discussions about your favorite episodes, plot twists,
              and characters. It’s the perfect spot to chat, laugh, and bond
              over everything K-Drama with Strangers.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
