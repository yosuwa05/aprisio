"use client";
import Image from "next/image";
import Link from "next/link";
import instagram from "../../../public/images/Instagram.png";
import facebook from "../../../public/images/facebook.png";
import logo from "../../../public/images/logo.png";
import mail from "../../../public/images/mail.png";
import twitter from "../../../public/images/twitter.png";
import phone from "../../../public/images/phone-icon.png";
export default function Footer() {
  return (
    <section className=''>
      <div className='bg-white  lg:grid-cols-3 grid-cols-1 gap-9 lg:gap-0 grid py-14  lg:px-24 px-5'>
        <div className='w-1/3'>
          <h1 className='text-[#043A53] xl:text-3xl text-2xl  pb-4  xl:pb-8 font-roboto font-semibold'>
            Aprisio
          </h1>

          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-3'>
              <Image className='w-6 h-6' src={mail} alt='email' />
              <a
                href='mailto: support@aprisio.com'
                className='text-[#353535E3] font-sans xl:text-2xl text-xl'>
                support@aprisio.com
              </a>
            </div>
            <div className='flex items-center gap-3'>
              <Image className='w-6 h-6' src={phone} alt='phone' />
              <a
                href='tel:+917411522330'
                className='text-[#353535E3] text-nowrap  font-sans xl:text-2xl text-xl'>
                +91-7411522330
              </a>
            </div>
          </div>
        </div>
        {/* about */}
        <div>
          <h1 className='text-[#043A53] font-roboto font-semibold xl:text-3xl text-2xl xl:pb-8 pb-4'>
            About Us
          </h1>
          <p className='text-[#353535E3] font-sans xl:text-2xl text-xl'>
            Aprisio enables post career individuals to discover and access new
            events & experiences, foster meaningful connections and pursue new
            interests to retain their zest for life.
          </p>
          {/* social icons */}
          <div className='flex pt-5 lg:gap-5 gap-3'>
            <Image className='w-10 h-10' src={instagram} alt='email' />
            <Image className='w-10 h-10' src={facebook} alt='email' />
            <Image className='w-10 h-10' src={twitter} alt='email' />
          </div>
        </div>

        {/* Navigations */}
        <div className='flex flex-col lg:items-end'>
          <div>
            <h1 className='text-[#043A53] xl:pb-8 pb-4 font-roboto xl:text-3xl text-2xl font-semibold'>
              Navigations
            </h1>
            <ul className='flex flex-col xl:gap-4 lg:gap-2 font-mulish'>
              <Link href='/#home'>
                <li className='xl:text-2xl text-xl text-[#353535E3]'>Home</li>
              </Link>
              <Link href='/#footer'>
                <li className='xl:text-2xl text-xl text-[#353535E3]'>
                  Contact
                </li>
              </Link>
              <Link href={"/privacy-policy"}>
                <li className='xl:text-2xl text-xl text-[#353535E3]'>
                  Privacy Policy
                </li>
              </Link>

              <Link href={"/terms-of-use"}>
                {" "}
                <li className='xl:text-2xl text-xl text-[#353535E3]'>
                  Terms of Use
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </div>

      <div className=' font-mulish text-xl bg-[#F2F5F6] text-[#043A53] lg:px-24 lg:py-7 py-3 px-3 flex md:justify-between justify-center  items-center'>
        {/* <p className="md:block hidden">Aprisio</p> */}
        <div className=''>
          <Image src={logo} className='h-6 md:block hidden  w-24 ' alt='logo' />
        </div>

        <p className='md:block hidden'>2025</p>
      </div>
    </section>
  );
}
