import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
	name: z.string().min(4, "Genre name is too short"),
});

export default function CreateGenre({ onSuccess }: { onSuccess?: () => void }) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});
	const createGenre = useMutation({
		mutationFn: async ({ name }: { name: string }) => {
			//FIXME: replace this with a real API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return { name };
		},
		onSuccess,
	});
	const onSubmit = (data: { name: string }) => {
		createGenre.mutate(data);
	};
	return (
		<Form {...form}>
			<div>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="Horror.." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					className="mt-4"
					type="button"
					onClick={form.handleSubmit(onSubmit)}
					disabled={createGenre.isPending}
				>
					{createGenre.isPending ? "Creating Genre..." : "Submit"}
				</Button>
			</div>
		</Form>
	);
}
