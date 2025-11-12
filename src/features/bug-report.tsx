"use client";

import { HelpCircle } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { bugReportAction } from "@/actions/bug-report";
import {
	BugReportSchema,
	BugReportSchemaType,
} from "@/actions/bug-report/schema";
import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useZodForm,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useReportModal } from "@/store/use-report-modal";

export const BugReport = () => {
	const open = useReportModal((state) => state.open);
	const setOpen = useReportModal((state) => state.setOpen);

	const form = useZodForm({
		schema: BugReportSchema,
	});

	const { executeAsync, isPending } = useAction(bugReportAction, {
		onSuccess: () => {
			setOpen(false);

			toast.success("Votre signalement a bien été envoyé !");
		},
		onError: ({ error }) => {
			toast.error(error.serverError);
		},
	});

	const onSubmit = (data: BugReportSchemaType) => {
		executeAsync(data);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
					<HelpCircle className="size-5" />
					Signalé un bug
				</DropdownMenuItem>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Signalé un bug</DialogTitle>
					<DialogDescription>
						Lorem, ipsum dolor sit amet consectetur adipisicing
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
					>
						<FormField
							control={form.control}
							name="message"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Message</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											placeholder="Votre message..."
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<DialogClose asChild>
								<Button variant="secondary">Annuler</Button>
							</DialogClose>
							<LoadingButton type="submit" loading={isPending}>
								Envoyer
							</LoadingButton>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
