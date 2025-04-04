"use client";

import location from "@img/images/location.png";
import logo from "@img/images/betalogo.png";
import startup from "@img/images/startup.jpeg";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import instagram from "../../../public/images/Instagram.png";
import linkedin from "../../../public/images/linkedin.png";
import facebook from "../../../public/images/facebook.png";
import mail from "../../../public/images/mail.png";
import phone from "../../../public/images/phone-icon.png";
import twitter from "../../../public/images/twitter.png";
export default function Footer() {
  const router = useRouter();

  return (
    <section className=''>
      <div className='bg-white lg:grid-cols-3 grid-cols-1 gap-9 lg:gap-0 grid py-14 lg:px-24 px-5'>
        <div className='w-full md:w-[80%]'>
          <Image
            src={logo}
            className='w-[120px] xl:w-[180px] cursor-pointer  py-2'
            alt='logo'
            priority={true}
            onClick={() => router.push("/")}
          />

          <div className='flex flex-col gap-4'>
            <div className='flex flex-1 gap-3 w-full'>
              <Image className='w-6 h-6' src={location} alt='location' />
              <div className='text-[#353535E3] font-sans xl:text-2xl text-xl w-full'>
                Age Wise Digital Solutions Private Limited, Workden, 2nd Floor,
                No. 775, 100 Feet Road, Indiranagar, Bangalore - 560008
              </div>
            </div>

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
                className='text-[#353535E3] text-nowrap font-sans xl:text-2xl text-xl'>
                +91-7411522330
              </a>
            </div>
          </div>
        </div>
        <div className='flex flex-col '>
          <div
            className='cursor-pointer'
            onClick={() => {
              const pdfPath =
                "/images/Startup_Recognition_Certificate_110225.pdf";
              if (typeof window !== "undefined") {
                window.open(pdfPath, "_blank");
              }
            }}>
            <Image
              src={startup}
              className='w-[120px] xl:w-[180px] cursor-pointer   py-2'
              alt='logo'
              priority={true}
            />
            <p className='text-[#353535E3] font-sans xl:text-2xl text-xl'>
              Proudly recognized by Startup India
            </p>
          </div>
          <div className='flex pt-5 lg:gap-5 gap-3'>
            <Link
              href='https://www.instagram.com/aprisio_experiences/'
              target='_blank'
              rel='noopener noreferrer'>
              <Image className='w-10 h-10' src={instagram} alt='email' />
            </Link>
            <Link
              href='https://www.linkedin.com/company/aprisio/posts/?feedView=all'
              target='_blank'
              rel='noopener noreferrer'>
              <Image className='w-10 h-10' src={linkedin} alt='email' />
            </Link>
          </div>
        </div>

        <div className='flex flex-col lg:items-end'>
          <div>
            <ul className='flex flex-col xl:gap-4 lg:gap-2 font-mulish'>
              <Link href='/#home'>
                <li className='xl:text-2xl text-xl text-[#353535E3]'>Home</li>
              </Link>
              <Link href='/contact'>
                <li className='xl:text-2xl text-xl text-[#353535E3]'>
                  Contact
                </li>
              </Link>
              <Link href={"/privacy-policy"} target='_blank'>
                <li className='xl:text-2xl text-xl text-[#353535E3]'>
                  Privacy Policy
                </li>
              </Link>

              <Link href={"/terms-of-use"} target='_blank'>
                {" "}
                <li className='xl:text-2xl text-xl text-[#353535E3]'>
                  Terms of Use
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </div>

      <div className='font-mulish text-xl bg-[#F2F5F6] text-[#043A53] lg:px-24 lg:py-7 py-3 px-3 flex md:justify-between justify-center items-center'>
        {/* <p className="md:block hidden">Aprisio</p> */}
        <div className=''>
          <Image
            src={logo}
            className='w-[120px] cursor-pointer md:block hidden'
            alt='logo'
            priority={true}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>

        <p className='md:block hidden'>2025</p>
      </div>
    </section>
  );
}
