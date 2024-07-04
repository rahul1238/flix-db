import { useParams } from "react-router-dom"
import MovieForm from "../components/form";

export default function EditMoviePage() {
    const { id } = useParams();
    return (
        <div>
            <MovieForm />
        </div>
    )
}