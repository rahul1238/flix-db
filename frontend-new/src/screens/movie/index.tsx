import { movies as MOVIES } from "@/constants/data";
import { useQuery } from "@tanstack/react-query";
import { first } from "lodash";
import { useParams } from "react-router-dom";

// url()
export default function MoviePage() {
    const { id } = useParams();
    const { data: movie, isLoading } = useQuery({
        queryKey: ['movie', id], queryFn: () => {
            return MOVIES.find(movie => {
                return movie.id === Number(id);
            });
        }
    })
    if (isLoading)
        return <>loading...</>
    return (
        <div className="h-screen">
            <div style={{
                background: `linear-gradient(to top, rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%)`
            }} className="h-full w-full top-0 left-0 inline-block">
                <img src={first(movie?.images)} className="relative -z-[1] w-full object-cover h-full" alt="" />
                <main className="space-y-4 p-8 text-white z-50 absolute top-0 left-0">
                    <div className="w-full items-center flex justify-between">
                        <h2 className="text-5xl font-bold">{movie?.title}</h2>
                    </div>
                    <p className="max-w-lg">{movie?.description}</p>
                    <p className="max-w-lg">{movie?.genre}</p>
                    <h4 className="text-2xl font-bold">Images</h4>
                    {movie?.images?.length && (
                        <div className="grid grid-cols-3 gap-2">
                            {movie?.images.map((src) => {
                                return (
                                    <button>
                                        <img
                                            alt={movie?.title}
                                            className="aspect-square w-32 rounded-md object-cover"
                                            height="84"
                                            src={src}
                                            width="84"
                                        />
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}