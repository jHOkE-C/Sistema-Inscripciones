import { Card, CardContent, CardTitle } from "@/components/ui/card";
import FormAddArea from "./FormAddArea";
import ListArea from "./ListArea";

export const page = () => {
    return (
        <>
            <div className="w-4/5 mx-auto  mt-10">
                <Card>
                    <CardTitle>
                        <h1 className="text-4xl font-bold text-center py-5">
                            Gestion de Areas
                        </h1>
                    </CardTitle>
                    <CardContent>
                        <FormAddArea />
                        <ListArea />
                    </CardContent>
                </Card>
            </div>
        </>
    );
};
export default page;
