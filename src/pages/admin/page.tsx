import Botones from "./botones";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { rutasAdmin } from "./rutas-admin";
import { UserPanel } from "./user-panel";

const Admin = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header rutas={rutasAdmin} />
      <UserPanel />
      <div className="w-full p-4 md:w-4/5 mx-auto">
        <div className="flex justify-end"></div>
        <Botones />
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
