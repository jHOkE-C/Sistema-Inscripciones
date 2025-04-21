import FileUploadFormato from "@/pages/admin/subirExcel/fileUploadFormato";
import ReturnComponent from "@/components/ReturnComponent";
export const Page = () => {
  return (
    <>
      <div className="flex flex-col items-center min-h-screen p-4">
        <div className="w-full">
          <ReturnComponent to="/admin" />
        </div>
        <FileUploadFormato />
      </div>
    </>
  );
};

export default Page;
