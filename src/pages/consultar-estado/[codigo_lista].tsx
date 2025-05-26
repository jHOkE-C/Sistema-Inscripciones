import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Lista from "./lista";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <Header />
        <Lista />
      <Footer />
    </div>
  );
};

export default Page;
