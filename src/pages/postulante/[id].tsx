import { useParams } from "react-router-dom";

const Postulante = () => {
    const { id } = useParams();
    return (
        <div>
            <h1>Postulante {id}</h1>
        </div>
    );
};

export default Postulante;
