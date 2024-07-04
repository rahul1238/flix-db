import { MoviesTable } from "@/components/tables/movies-table";
import { movies as Movies } from "@/constants/data";
import { queryClient } from "@/main";
import type { Movie } from "@/types/movies";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const getDashboardMoviesQueryKey = () => ["movies"];

export const refetchDashboardMovies = () => {
	return queryClient.refetchQueries({
		queryKey: getDashboardMoviesQueryKey(),
	});
};

export default function DashboardMoviesPage() {
	const { data: movies } = useQuery({
		queryKey: getDashboardMoviesQueryKey(),
		queryFn: async () => {
			const id = toast.loading("Loading movies...", {
				position: "top-right",
			});
			await new Promise<void>((resolve) => {
				setTimeout(() => {
					resolve();
				}, 3000);
			});
			toast.dismiss(id);
			return Movies;
		},
	});
	return <MoviesTable data={Movies as Movie[]} />;
}
