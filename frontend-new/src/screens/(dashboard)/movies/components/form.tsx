import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Check, ChevronsUpDown } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { create, isEmpty, set } from "lodash";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CreateGenreForm from "./create-genre";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";

const getGenresQueryKey = () => ["genres"];

const formSchema = z.object({
	title: z.string({
		required_error: "Title is required",
	}),
	description: z.string({
		required_error: "Description is required",
	}),
	genre: z.string({
		required_error: "Genre is required",
	}),
	origin: z.string({
		required_error: "Origin is required",
	}),
	releaseDate: z.date({
		required_error: "Release date is required",
	}),
});

export default function MovieForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			origin: "",
		},
	});
	const { data: genres, isLoading: areGenresLoading } = useQuery({
		queryKey: getGenresQueryKey,
		queryFn: async () => {
			//FIXME: replace with actual API call
			await new Promise<void>((resolve) => {
				setTimeout(() => {
					resolve();
				}, 3000);
			});
			return [
				{ label: "Action", value: "action" },
				{ label: "Adventure", value: "adventure" },
				{ label: "Comedy", value: "comedy" },
				{ label: "Drama", value: "drama" },
				{ label: "Fantasy", value: "fantasy" },
				{ label: "Horror", value: "horror" },
				{ label: "Mystery", value: "mystery" },
				{ label: "Romance", value: "romance" },
				{ label: "Sci-Fi", value: "sci-fi" },
				{ label: "Thriller", value: "thriller" },
			];
		},
	});
	const navigate = useNavigate();
	const createMovie = useMutation({
		mutationFn: async (values: z.infer<typeof formSchema>) => {
			await new Promise<void>((resolve) => {
				setTimeout(() => {
					resolve();
				}, 3000);
			});
			console.log(values);
		},
		onSuccess: () => {},
	});
	function onSubmit(values: z.infer<typeof formSchema>) {
		toast.promise(createMovie.mutateAsync(values), {
			loading: "Creating movie...",
			success: () => {
				navigate("..");
				return "Movie created successfully";
			},
			error: "Failed to create movie",
		});
	}
	const portalRef = useRef<HTMLDivElement>(null);
	return (
		<Form {...form}>
			<div ref={portalRef} />
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input placeholder="Inception" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="origin"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Origin</FormLabel>
							<FormControl>
								<Input
									placeholder={
										"Hollywood/ Bollywood/ Nollywood/ Kollywood/ Tollywood..."
									}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder={"Epic movie about dreams and reality...."}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="genre"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Genre</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											disabled={areGenresLoading}
											variant="outline"
											role="combobox"
											className={cn(
												"w-[200px] justify-between",
												!field.value && "text-muted-foreground",
											)}
										>
											{areGenresLoading
												? "Loading..."
												: field.value
												  ? genres?.find(
															(language) => language.value === field.value,
													  )?.label
												  : "Select Genre"}
											<ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-[200px] p-0">
									<Command>
										<CommandInput placeholder="Search genre..." />
										<CommandEmpty>
											No Genre found.
											<CreateGenre />
										</CommandEmpty>
										<CommandGroup>
											<CommandList>
												{genres?.map((genre) => (
													<CommandItem
														value={genre.label}
														key={genre.value}
														onSelect={() => {
															form.setValue("genre", genre.value);
														}}
													>
														<Check
															className={cn(
																"mr-2 h-4 w-4",
																genre.value === field.value
																	? "opacity-100"
																	: "opacity-0",
															)}
														/>
														{genre.label}
													</CommandItem>
												))}
											</CommandList>
										</CommandGroup>
									</Command>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="releaseDate"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Release Date</FormLabel>
							<div>
								<FormControl>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className={cn(
														"w-[240px] pl-3 text-left font-normal",
														!field.value && "text-muted-foreground",
													)}
												>
													{field.value ? (
														format(field.value, "PPP")
													) : (
														<span>Pick a date</span>
													)}
													<CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												disabled={(date) =>
													date > new Date() || date < new Date("1900-01-01")
												}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
								</FormControl>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}

const CreateGenre = () => {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();
	const onSuccess = () => {
		queryClient?.refetchQueries({
			queryKey: getGenresQueryKey(),
		});
		setOpen(false);
	};
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger>
				<Button className="mt-4">Create New Genre</Button>
			</PopoverTrigger>
			<PopoverContent>
				<CreateGenreForm onSuccess={onSuccess} />
			</PopoverContent>
		</Popover>
	);
};
