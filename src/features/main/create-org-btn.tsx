"use client";

import imageCompression from "browser-image-compression";
import { PlusCircle } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { createOrgAction } from "@/actions/organization/create";
import {
	CreateOrgSchema,
	CreateOrgSchemaType,
} from "@/actions/organization/create/schema";
import { LoadingButton } from "@/components/loading-button";
import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Input } from "@/components/ui/input";
import { dialog } from "@/providers/dialog-provider";
import { ImageUploader } from "../image-uploader";

const CreateForm = () => {
	const form = useZodForm({
		schema: CreateOrgSchema,
		defaultValues: {
			name: "",
			slug: "",
		},
	});

	const { executeAsync, isPending } = useAction(createOrgAction, {
		onSuccess: ({ data }) => {
			toast.success(`Organisation "${data?.name}" créée avec succès !`);
			
			if (typeof window !== "undefined") {
				window.location.reload();
			}

		},
		onError: ({ error }) => {
			toast.error(error.serverError);
		},
	});

	const onSubmit = async (data: CreateOrgSchemaType) => {
		let compressedFiles: any = [];

		if (data.files && data.files.length > 0) {
			const compressed = await imageCompression(data.files[0], {
				maxSizeMB: 2,
				maxWidthOrHeight: 2000,
				useWebWorker: true,
			});

			compressedFiles = [compressed];
		}

		await executeAsync({ ...data, files: compressedFiles });
	};

	return (
		<>
			<AlertDialogHeader>
				<AlertDialogTitle>
					Créer une nouvelle organisation
				</AlertDialogTitle>
				<AlertDialogDescription>
					Créez une organisation pour regrouper des membres et
					collaborer efficacement.
				</AlertDialogDescription>
			</AlertDialogHeader>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<ImageUploader form={form} fieldName="files" label="Logo" />
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nom de l'organisation</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder="Nom de l'organisation"
										onChange={(event) => {
											const value = event.target.value;

											field.onChange(value);

											const slug = value
												.normalize("NFD")
												.replace(/[\u0300-\u036f]/g, "")
												.replace(/[^a-zA-Z0-9 ]/g, "")
												.trim()
												.toLowerCase()
												.replace(/\s+/g, "-");

											form.setValue("slug", slug);
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="slug"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Slug</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder="slug-de-l-organisation"
										autoComplete="off"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<AlertDialogFooter>
						<AlertDialogCancel type="button">
							Retour
						</AlertDialogCancel>
						<AlertDialogAction disabled={isPending} asChild>
							<LoadingButton loading={isPending} type="submit">
								Créer
							</LoadingButton>
						</AlertDialogAction>
					</AlertDialogFooter>
				</form>
			</Form>
		</>
	);
};

export const CreateOrgBtn = () => {
	return (
		<DropdownMenuItem
			onClick={() => {
				dialog.add({
					children: <CreateForm />,
				});
			}}
		>
			<PlusCircle className="size-5" />
			Créer une organisation
		</DropdownMenuItem>
	);
};
