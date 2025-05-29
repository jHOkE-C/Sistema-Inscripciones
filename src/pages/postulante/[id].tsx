import { useParams } from "react-router-dom";

const Postulante = () => {
    const { id } = useParams();
    return (
        <div>
            <h2>Postulante {id}</h2>
        </div>
    );
};

export default Postulante;
