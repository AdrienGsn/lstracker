"use client";

import { fantomeAction } from "@/actions/fantome";
import { FamtomeSchema } from "@/actions/fantome/schema";
import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

export const Fantome = () => {
	const form = useZodForm({
		schema: FamtomeSchema,
		defaultValues: {
			lat: "",
			lng: "",
		},
	});

	const { executeAsync, isPending } = useAction(fantomeAction, {
		onSuccess: () => {
			toast.success("Fantome ajouté avec succés !");

			document.location.reload();
		},
		onError: ({ error }) => {
			toast.error(error.serverError);
		},
	});

	const onSubmit = async (data: { lat: string; lng: string }) => {
		await executeAsync(data);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="secondary"
					className="top-2 left-2 absolute z-50 pointer-events-auto"
				>
					AJOUTER FANTOME
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid gap-4"
					>
						<DialogHeader>
							<DialogTitle>Ajouter Fantome</DialogTitle>
						</DialogHeader>
						<div className="grid gap-4">
							<FormField
								control={form.control}
								name="lat"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Latitude</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="0.00"
												type="text"
												inputMode="decimal"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lng"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Longitude</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="0.00"
												type="text"
												inputMode="decimal"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">Cancel</Button>
							</DialogClose>
							<LoadingButton
								type="submit"
								loading={isPending}
								disabled={false}
							>
								Ajouter
							</LoadingButton>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
