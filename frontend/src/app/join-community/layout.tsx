import Topbar from "@/components/shared/topbar";
import Footer from "../../components/shared/footer";

export default function JoinLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <section className="min-h-screen">
        <Topbar />
        {children}
        <div className="mt-14">
          <Footer />
        </div>
      </section>
    </>
  );
}
