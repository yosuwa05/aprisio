import Image from "next/image";
import quote from "../../../public/images/quote.png";
import rect2 from "../../../public/images/Rectangle-2.png";
import rect3 from "../../../public/images/Rectangle3.png";
import rect1 from "../../../public/images/Rectangle_red.png";
import uncle from "../../../public/images/uncle.png";

const testimonials = [
  {
    id: 1,
    rectImage: rect1,
    clientImage: "/images/Nitin_Mathur.jpeg",
    text: "Almost everything in urban India seems tailored for folks between 15-35 years of age, leaving others struggling to find a community of like-minded individuals, who share their interests and are at a similar life stage. Aprisio recognizes this challenge and offers curated solutions to bridge this gap. With Aprisio I Look forward to finding my tribe and indulging in my passion for travel, food, history, culture, and adventure.",
    name: "Nitin Mathur",
    location: "Consultant - Startups & early-stage ventures",
  },
  {
    id: 2,
    clientImage: "/images/Chandan_Dey.jpg",
    rectImage: rect2,
    text: "Staying active post-career is important to me, but joining general fitness groups often feels out of sync with my pace and goals. I’m thrilled to discover Aprisio which is a community of post career people like me. Whether it’s hiking, running, or yoga, having a community where I feel understood and included is something I’ve been looking for.",
    name: "Chandan Dey",
    location: "Independent Audio-Visual Producer",
  },
  {
    id: 3,
    clientImage: "/images/Radhika_Sen.jpeg",
    rectImage: rect3,
    text: "I am excited to be part of Aprisio that connects seasoned talent, looking for different career paths, with meaningful and relevant opportunities. It allows me to leverage my existing expertise AND explore new areas / communities to help me in my life-long learning pursuit.",
    name: "Radhika Sen",
    location: "Market Research Consultant       ",
  },
];

export default function Testimonial() {
  return (
    <section className="lg:px-14 px-5 lg:pb-28 pb-8">
      <div className="lg:py-16 py-8">
        <h1 className="text-[#353535] font-roboto xl:text-8xl lg:text-5xl text-2xl font-semibold text-center">
          User Testimonials
        </h1>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10 relative">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="relative flex flex-col  min-h-full">
            <div className="bg-white rounded-3xl border flex flex-col  min-h-full">
              <div className="pt-9 px-9">
                <Image src={quote} alt="quote" className="xl:h-9 xl:w-9 w-6 h-6" />
              </div>
              <div>
                <Image
                  src={testimonial.rectImage}
                  alt="rect"
                  className="h-16 w-16 absolute left-4 xl:top-24 lg:top-20"
                />
              </div>
              <div className="flex flex-col justify-between  flex-grow">

                <p className="text-[#353535] px-9 xl:text-2xl lg:text-base text-xl font-sans py-6 z-10 relative">
                  {testimonial.text}
                </p>
           
<div className="">
<hr className="bg-[#E9E9E9]  h-0.5 w-full" />
<div className="xl:py-9 w-full xl:px-9 md:py-5 md:px-5 px-5 gap-5 py-4 flex items-center justify-between">
  {/* Fixed size for the image */}
  <div className="md:w-[25%]">
    <img
      src={testimonial.clientImage}
      alt="client"
      // width={16}
      // height={16}
      className="md:h-20 md:w-20 h-16 w-16  rounded-full object-cover"
    />
  </div>

  {/* Remaining space for the name and location */}
  <div className="flex-grow ml-5">
    <p className="text-[#353535] font-sans xl:text-[1.5rem] text-[1rem]">
      {testimonial.name}
    </p>
    <p className="text-[#35353599] font-sans xl:text-[1.25rem] text-[1rem]">
      {testimonial.location}
    </p>
  </div>
</div>

</div>
         
    
               
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
