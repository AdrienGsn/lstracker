"use client";

import imageCompression from "browser-image-compression";

import { createOrgAction } from "@/actions/organization/create";
import {
	CreateOrgSchema,
	CreateOrgSchemaType,
} from "@/actions/organization/create/schema";
import { LoadingButton } from "@/components/loading-button";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import {
	Stepper,
	StepperContent,
	StepperDescription,
	StepperIndicator,
	StepperItem,
	StepperList,
	StepperNextTrigger,
	StepperProps,
	StepperSeparator,
	StepperTitle,
	StepperTrigger,
} from "@/components/ui/stepper";
import { Typography } from "@/components/ui/typography";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { DiscordServerSelector } from "./discord-server-selector";
import { ImageUploader } from "./image-uploader";

const steps = [
	{
		value: "one",
		title: "Bienvenue",
		description: "Commencez ici",
		fields: [] as const,
	},
	{
		value: "two",
		title: "Organisation",
		description: "Décrivez votre organisation",
		fields: ["name", "slug"] as const,
	},
	{
		value: "three",
		title: "Discord",
		description: "Reliez votre Discord",
		fields: ["guildId"] as const,
	},
];

export const OnBoarding = () => {
	const router = useRouter();

	const [currentStep, setCurrentStep] = useState("one");

	const { executeAsync, isPending } = useAction(createOrgAction, {
		onSuccess: () => {
			router.replace("/");
		},
		onError: ({ error }) => {
			toast.error(error.serverError);
		},
	});

	const form = useZodForm({
		schema: CreateOrgSchema,
		defaultValues: {
			name: "",
			slug: "",
			guildId: "",
		},
	});

	const currentIndex = steps.findIndex((step) => step.value === currentStep);

	const onValidate: NonNullable<StepperProps["onValidate"]> = useCallback(
		async (_value, direction) => {
			if (direction === "prev") return true;

			const currentStepData = steps.find((s) => s.value === currentStep);

			if (!currentStepData) return true;

			const isValid = await form.trigger(currentStepData.fields);

			if (!isValid) {
				toast.info(
					"Veuillez remplir tous les champs requis pour continuer"
				);
			}

			return isValid;
		},
		[form, currentStep]
	);

	const onValueChange = useCallback((step: string) => {
		setCurrentStep(step);
	}, []);

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
		<div className="size-full max-w-7xl mx-auto p-4 flex items-center justify-center">
			<Card className="max-w-9/12 max-h-6/12 size-full">
				<Stepper
					value={currentStep}
					onValueChange={onValueChange}
					onValidate={onValidate}
					className="h-full"
				>
					<CardHeader className="flex items-center justify-between gap-20">
						<Logo showTitle />
						<StepperList>
							{steps.map((step) => (
								<StepperItem
									key={step.value}
									value={step.value}
								>
									<StepperTrigger
										onClick={(event) => {
											event.preventDefault();
										}}
									>
										<StepperIndicator />
										<div className="flex flex-col gap-px">
											<StepperTitle>
												{step.title}
											</StepperTitle>
											<StepperDescription>
												{step.description}
											</StepperDescription>
										</div>
									</StepperTrigger>
									<StepperSeparator className="mx-4" />
								</StepperItem>
							))}
						</StepperList>
					</CardHeader>
					<CardContent className="h-full">
						<Form {...form}>
							<form
								className="size-full flex flex-col"
								onSubmit={form.handleSubmit(onSubmit)}
							>
								<StepperContent
									value="one"
									className="flex flex-col gap-4 items-center justify-center"
								>
									<Typography variant="h1">
										Bienvenue !
									</Typography>
									<Typography className="text-center max-w-md text-muted-foreground">
										Nous sommes ravis de vous accueillir
										dans le processus de création de votre
										organisation. Cliquez sur
										&quot;Suivant&quot; pour commencer la
										configuration de votre espace.
									</Typography>
								</StepperContent>
								<StepperContent
									value="two"
									className="flex flex-col gap-4"
								>
									<div className="w-full relative">
										<ImageUploader
											form={form}
											fieldName="files"
											label="Logo"
										/>
									</div>
									<div className="flex items-start justify-between gap-4">
										<FormField
											control={form.control}
											name="name"
											render={({ field }) => (
												<FormItem className="w-full">
													<FormLabel>
														Nom de l'organisation
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															placeholder="Nom de l'organisation"
															onChange={(
																event
															) => {
																const value =
																	event.target
																		.value;

																field.onChange(
																	value
																);

																const slug =
																	value
																		.normalize(
																			"NFD"
																		)
																		.replace(
																			/[\u0300-\u036f]/g,
																			""
																		)
																		.replace(
																			/[^a-zA-Z0-9 ]/g,
																			""
																		)
																		.trim()
																		.toLowerCase()
																		.replace(
																			/\s+/g,
																			"-"
																		);

																form.setValue(
																	"slug",
																	slug
																);
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
												<FormItem className="w-full">
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
									</div>
								</StepperContent>
								<StepperContent
									value="three"
									className="flex flex-col gap-4 items-center justify-center"
								>
									<Typography variant="h3">
										Connectez votre serveur Discord
									</Typography>
									<Typography className="text-muted-foreground mb-4 text-center">
										Invitez le bot sur votre serveur Discord
										et sélectionnez-le ci-dessous.
									</Typography>
									<DiscordServerSelector
										form={form}
										fieldName="guildId"
									/>
								</StepperContent>
								<div className="mt-auto flex justify-end">
									{currentIndex === steps.length - 1 ? (
										<LoadingButton
											type="submit"
											loading={isPending}
										>
											Terminer
										</LoadingButton>
									) : (
										<StepperNextTrigger asChild>
											<Button>Suivant</Button>
										</StepperNextTrigger>
									)}
								</div>
							</form>
						</Form>
					</CardContent>
				</Stepper>
			</Card>
		</div>
	);
};
