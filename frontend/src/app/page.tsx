"use client";

import { TopCommunityBar } from "@/components/community/top-community-bar";
import Hero1 from "@/components/shared/hero1";
import Topbar from "@/components/shared/topbar";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import About from "../components/shared/about";
import Events from "../components/shared/events";
import FAQ1 from "../components/shared/faq-one";
import FAQ2 from "../components/shared/faq-two";
import Footer from "../components/shared/footer";
import Testimonial from "../components/shared/testimonials";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import coffeeImage from "@img/images/coffeebanner.jpeg";
export default function Home() {
  const router = useRouter();
  const user = useGlobalAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    // Check if the popup has been shown before
    const hasSeenPopup = localStorage.getItem("popup_shown");

    // Only show popup if it hasn't been shown before
    if (hasSeenPopup !== "true") {
      setShowPopup(true);
      localStorage.setItem("popup_shown", "true");
    }

    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <div className='w-screen h-screen bg-white'></div>;
  }

  return (
    <>
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className='max-w-2xl md:max-w-3xl lg:max-w-4xl w-full p-4 md:p-6 cursor-pointer  lg:p-8'>
          <div
            onClick={() => {
              router.push("/top-events/67d7d2e814e0a096fc38974b");
            }}
            className='w-full flex justify-center'>
            <Image
              src={coffeeImage}
              alt='Welcome'
              loading='eager'
              className='w-full h-auto max-h-[80vh] object-cover rounded-lg'
            />
          </div>
        </DialogContent>
      </Dialog>

      <div className='sticky top-[-2px] z-50 bg-white py-2'>
        <Topbar />
        {user && <TopCommunityBar />}
      </div>
      <ToastContainer />
      <div>
        <section id='home'>
          <Hero1 />
        </section>
        <FAQ1 />
        <FAQ2 />
        <div id='about'>
          <About />
        </div>
        <div id='events'>
          <Events />
        </div>
        <Testimonial />
        {/* <div id="join">
            <Join />
          </div> */}
        <div id='footer'>
          <Footer />
        </div>
      </div>
    </>
  );
}
