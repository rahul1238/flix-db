import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Movie } from "@/types/movies"
import { first } from "lodash"
import { Link } from "react-router-dom";

export default function MovieCard(props: Partial<Movie>) {
    const {
        title,
        genre,
        description,
        images,
        id
    } = props;
    return (
        <Link to={id?.toString() ?? '0'}>
            <Card
                className="overflow-hidden max-w-md"
            >
                <CardHeader>
                    <CardTitle className="text-xl">{title}</CardTitle>
                    <CardDescription>
                        {genre}
                        {description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {images?.length && (
                        <div className="grid gap-2">
                            <img
                                alt={title}
                                className="aspect-square w-full rounded-md object-cover"
                                height="300"
                                src={first(images)}
                                width="300"
                            />
                            <div className="grid grid-cols-3 gap-2">
                                {images.slice(1).map((src) => {
                                    return (
                                        <button>
                                            <img
                                                alt={title}
                                                className="aspect-square w-full rounded-md object-cover"
                                                height="84"
                                                src={src}
                                                width="84"
                                            />
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    )
}