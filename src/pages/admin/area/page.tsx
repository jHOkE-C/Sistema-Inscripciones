import FormAddArea from "./formAddArea";

export const page = () => {
    return (
        <>
            <div className="w-4/5 mx-auto ">
                <h1 className="text-4xl font-bold text-center py-5">
                    Gestion de Areas
                </h1>
                <FormAddArea />
            </div>
        </>
    );
};
export default page;
