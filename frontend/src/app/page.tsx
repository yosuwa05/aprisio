import { ToastContainer } from "react-toastify";
import About from "../components/shared/About";
import Events from "../components/shared/Events";
import FAQ1 from "../components/shared/FAQ1";
import FAQ2 from "../components/shared/FAQ2";
import Footer from "../components/shared/Footer";
import Hero from "../components/shared/Hero";
import Join from "../components/shared/Join";
import NavBar from "../components/shared/NavBar";
import Testimonial from "../components/shared/Testimonials";

export default function Home() {
  return (
    <>
      <NavBar />
      <ToastContainer />
      <section id="home" className="pt-5">
        <div>
          <Hero />
        </div>
      </section>
      <div id="about">
        <About />
      </div>
      <FAQ1 />
      <FAQ2 />
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
