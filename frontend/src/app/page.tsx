"use client";

import Hero1 from "@/components/shared/hero1";
import { ToastContainer } from "react-toastify";
import About from "../components/shared/about";
import Events from "../components/shared/events";
import FAQ1 from "../components/shared/faq-one";
import FAQ2 from "../components/shared/faq-two";
import Footer from "../components/shared/footer";
import Join from "../components/shared/join";
import NavBar from "../components/shared/navbar";
import Testimonial from "../components/shared/testimonials";

export default function Home() {
  return (
    <>
      <NavBar />
      <ToastContainer />

      <section id="home" className="">
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
    </>
  );
}
