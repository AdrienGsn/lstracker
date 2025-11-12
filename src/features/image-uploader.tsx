"use client";

import { Button } from "@/components/ui/button";
import {
	FileUpload,
	FileUploadDropzone,
	FileUploadItem,
	FileUploadItemDelete,
	FileUploadItemMetadata,
	FileUploadItemPreview,
	FileUploadList,
	FileUploadTrigger,
} from "@/components/ui/file-upload";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	type FormProps,
} from "@/components/ui/form";
import { CloudUpload, X } from "lucide-react";
import * as React from "react";
import { FieldValues } from "react-hook-form";

export interface ImageUploaderProps<T extends FieldValues> {
	form: FormProps<T>["form"];
	fieldName: string;
	label?: string;
	description?: string;
	accept?: string;
	maxFiles?: number;
	maxSize?: number;
	multiple?: boolean;
	dropzoneClassName?: string;
	dropzoneText?: React.ReactNode;
}

export const ImageUploader = <T extends FieldValues>(
	props: ImageUploaderProps<T>
) => {
	return (
		<FormField
			control={props.form.control}
			name={props.fieldName as any}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{props.label ?? "Fichier"}</FormLabel>
					<FormControl>
						<FileUpload
							value={field.value}
							onValueChange={field.onChange}
							accept={props.accept ?? "image/*"}
							maxFiles={props.maxFiles ?? 1}
							maxSize={props.maxSize ?? 5 * 1024 * 1024}
							onFileReject={(_, message) => {
								props.form.setError(props.fieldName as any, {
									message,
								});
							}}
							multiple={props.multiple ?? false}
						>
							<FileUploadDropzone
								className={
									props.dropzoneClassName ??
									"flex-row flex-wrap border-dotted text-center"
								}
							>
								<CloudUpload className="size-4" />
								{props.dropzoneText ?? (
									<>
										Glissez-déposez ou
										<FileUploadTrigger asChild>
											<Button
												variant="link"
												size="sm"
												className="p-0"
											>
												choisissez des fichiers
											</Button>
										</FileUploadTrigger>
										pour téléverser
									</>
								)}
							</FileUploadDropzone>
							<FileUploadList>
								{Array.isArray(field.value) &&
									field.value.map(
										(file: File, index: number) => (
											<FileUploadItem
												key={index}
												value={file}
											>
												<FileUploadItemPreview />
												<FileUploadItemMetadata />
												<FileUploadItemDelete asChild>
													<Button
														variant="ghost"
														size="icon"
														className="size-7"
													>
														<X />
														<span className="sr-only">
															Supprimer
														</span>
													</Button>
												</FileUploadItemDelete>
											</FileUploadItem>
										)
									)}
							</FileUploadList>
						</FileUpload>
					</FormControl>
					<FormDescription>{props.description}</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
