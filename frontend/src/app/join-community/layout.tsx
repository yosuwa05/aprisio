import Footer from "../../components/shared/footer";
import NavBar from "../../components/shared/navbar";

export default function JoinLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <section className="min-h-screen">
        <NavBar />
        {children}
        <div className="mt-14">
          <Footer />
        </div>
      </section>
    </>
  );
}
