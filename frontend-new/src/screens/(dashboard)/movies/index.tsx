import { MoviesTable } from "@/components/tables/movies-table";
import { movies as Movies } from "@/constants/data";
import type { Movie } from "@/types/movies";
import { useQuery } from "@tanstack/react-query";

export default function DashboardMoviesPage() {
    const { data: movies } = useQuery({
        queryKey: ['movies'],
        queryFn: async () => {
            return Movies;
        }
    });
    return (
        <MoviesTable data={Movies as Movie[]} />
    )
}