import Botones from "./botones";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { UserPanel } from "./Panel";
import ReturnComponent from "@/components/ReturnComponent";
const Admin = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ReturnComponent />
      <UserPanel />
      <div className="w-full py-6 md:w-5/6 mx-auto">
        <div className="flex justify-end"></div>
        <Botones />
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
