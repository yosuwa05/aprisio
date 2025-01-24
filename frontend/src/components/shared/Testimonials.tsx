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
    text: "Aprisio has opened doors to new friendships and exciting opportunities. I feel more engaged and purposeful than ever before!",
    name: "Sarah M",
    location: "Banglore",
  },
  {
    id: 2,
    rectImage: rect2,
    text: "Joining Aprisio has reignited my passion for learning and connecting. It’s a community that truly values personal growth and connection.",
    name: "Thakar L",
    location: "Banglore",
  },
  {
    id: 3,
    rectImage: rect3,
    text: "Through Aprisio, I’ve discovered new interests and built lasting relationships. It’s the perfect space to stay active and inspired after retirement.",
    name: "Sharma T",
    location: "Banglore",
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
        {Array(1)
          .fill(null)
          .map((_, index) =>
            testimonials.map((testimonial) => (
              <div key={`${index}-${testimonial.id}`} className="relative ">
                <div className="bg-white rounded-3xl ">
                  <div className="pt-9 px-9">
                    <Image
                      src={quote}
                      alt="quote"
                      className="xl:h-9 xl:w-9 w-6 h-6"
                    />
                  </div>
                  <div>
                    <Image
                      src={testimonial.rectImage}
                      alt="rect"
                      className="h-16 w-16 absolute left-4 xl:top-24 lg:top-20"
                    />
                  </div>
                  <p className="text-[#353535] min-h-56 px-9 xl:text-2xl lg:text-base text-xl font-sans py-6 z-10 relative">
                    {testimonial.text}
                  </p>
                  <hr className="bg-[#E9E9E9] h-0.5 w-full" />
                  <div className="xl:py-9 xl:px-9 md:py-5 md:px-5 px-5 py-4 flex gap-4 items-center">
                    <div className="xl:h-20 xl:w-20 w-16 h-16 rounded-full">
                      <Image
                        src={uncle}
                        alt="uncle"
                        className="h-full w-full"
                      />
                    </div>
                    <div>
                      <p className="text-[#353535] font-sans xl:text-2xl text-lg">
                        {testimonial.name}
                      </p>
                      <p className="text-[#35353599] font-sans xl:text-2xl text-lg">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
      </div>
    </section>
  );
}
