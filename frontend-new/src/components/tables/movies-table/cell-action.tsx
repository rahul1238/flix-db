"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Movie } from "@/types/movies";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "lodash";
import { toast } from "sonner";
import { refetchDashboardMovies } from "@/screens/(dashboard)/movies";

interface CellActionProps {
	data: Movie;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();

	const onConfirm = async () => {
		toast.promise(
			async () => {
				return new Promise<{ name: string }>((resolve) => {
					setTimeout(() => {
						resolve({ name: get(data, "id").toString() });
					}, 2000);
				});
			},
			{
				loading: "Loading...",
				success: (data) => {
					setOpen(false);
					refetchDashboardMovies();
					return `${data.name} movie has been deleted`;
				},
				error: "Error",
			},
		);
	};
	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onConfirm}
				loading={loading}
			/>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="w-8 h-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="w-4 h-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>

					<DropdownMenuItem
						onClick={() => navigate(`/dashboard/movies/edit/${data.id}`)}
					>
						<Edit className="w-4 h-4 mr-2" /> Update
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setOpen(true)}>
						<Trash className="w-4 h-4 mr-2" /> Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
