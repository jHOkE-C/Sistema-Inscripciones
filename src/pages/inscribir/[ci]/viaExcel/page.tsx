import ExcelUploader from './excel';
import ReturnComponent from '@/components/ReturnComponent';
import { useParams } from 'react-router-dom';

export default function Page() {
    const { ci } = useParams();
    return (
        <>
            <ReturnComponent to={`/inscribir/${ci}`} />
            <ExcelUploader />
        </>
    );
} 