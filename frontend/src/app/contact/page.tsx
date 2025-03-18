import ContactForm from "@/components/shared/contactform";

export default function ContactPage() {
  return (
    <section className=' bg-[#F2F5F6]  pb-28'>
      <div className='lg:py-16 lg:px-28 px-5 pt-5 bg-white'>
        <div className='text-center flex w-full  flex-col gap-10 lg:pb-24 pb-10'>
          <h1 className='lg:text-6xl text-3xl pt-5 font-bold text-center font-mulish'>
            Contact
          </h1>
        </div>
        <div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
