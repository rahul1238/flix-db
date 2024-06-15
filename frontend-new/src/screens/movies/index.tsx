import MovieCard from "@/components/movie-card";
import { Input } from "@/components/ui/input";
import { movies as MOVIES } from "@/constants/data";
import { useQuery } from "@tanstack/react-query";
import { lowerCase } from "lodash";
import { useState } from "react";

export default function MoviesPage() {
    const [query, setQuery] = useState('');
    const { data: movies, isLoading } = useQuery({
        queryKey: ['movies', query], queryFn: async () => {
            // await new Promise(resolve => {
            //     setTimeout(() => resolve(null), 3000)
            // })
            return MOVIES.filter(movie => lowerCase(movie.title).includes(lowerCase(query)));
        }
    })
    return (
        <div>
            <header className="sticky top-0 bg-white px-8">
                <h1 className="underline text-3xl font-bold">FlixDB</h1>
            </header>
            <main className="space-y-4">
                <div className="w-full items-center px-8 py-4 flex justify-between sticky top-0 bg-white">
                    <h2 className="text-5xl font-bold">Movies</h2>
                    <Input value={query} onChange={(e) => setQuery(e.currentTarget.value)} className="max-w-64" placeholder="🔎 Search a movie..." />
                </div>
                <div className="grid gap-8 px-8 grid-cols-2 lg:grid-cols-3">
                    {isLoading && (
                        <div>loading...</div>
                    )}
                    {movies?.map((movie, i) => {
                        return <MovieCard
                            {...movie}
                            key={i} />
                    })}
                </div>
            </main>
        </div>
    )
}