"use client";

import { TopCommunityBar } from "@/components/community/top-community-bar";
import PersonalFeed from "@/components/pages/personalfeed";
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
import Join from "../components/shared/join";
import Testimonial from "../components/shared/testimonials";

export default function Home() {
  const router = useRouter();
  const user = useGlobalAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [user, router]);

  if (loading) {
    return <div className="w-screen h-screen bg-white"></div>;
  }

  return (
    <>
      <div className="sticky top-[-2px] z-50 bg-white py-2">
        <Topbar />
        {user && <TopCommunityBar />}
      </div>
      <ToastContainer />
      {!user ? (
        <div>
          <section id="home">
            <Hero1 />
          </section>
          <FAQ1 />
          <FAQ2 />
          <div id="about">
            <About />
          </div>
          <div id="events">
            <Events />
          </div>
          <Testimonial />
          <div id="join">
            <Join />
          </div>
          <div id="footer">
            <Footer />
          </div>
        </div>
      ) : (
        <PersonalFeed />
      )}
    </>
  );
}
