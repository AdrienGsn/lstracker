"use client";

import { Marker, Team } from "@prisma/client";
import {
	QueryClientProvider,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import type { Marker as LeafletMarker, LeafletMouseEvent, Map } from "leaflet";
import {
	Check,
	Copy,
	Fullscreen,
	Pencil,
	Trash,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { toast } from "sonner";

import "leaflet/dist/leaflet.css";

import { createMarkerAction } from "@/actions/marker/create";
import {
	CreateMarkerSchema,
	CreateMarkerSchemaType,
} from "@/actions/marker/create/schema";
import { deleteMarkerAction } from "@/actions/marker/delete";
import { updateMarkerAction } from "@/actions/marker/update";
import {
	UpdateMarkerSchema,
	UpdateMarkerSchemaType,
} from "@/actions/marker/update/schema";
import { LoadingButton } from "@/components/loading-button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import { Loader } from "@/components/ui/loader";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { dialog } from "@/providers/dialog-provider";
import { BlipSelector } from "./blip-selector";
import { LayerSelector } from "./layer-selector";

const fetchMarkers = async () => {
	const response = await fetch("/api/markers");

	if (!response.ok) {
		throw new Error("Erreur lors de la récupération des marqueurs");
	}

	return response.json() as Promise<Marker[]>;
};

type MarkerPopupProps = {
	marker: Marker;
};

type CreateMarkerModalState = {
	isOpen: boolean;
	lat: string;
	lng: string;
};

type CreateMarkerModalProps = {
	teams: Team[];
	isOpen: boolean;
	lat: string;
	lng: string;
	onClose: () => void;
	onCreated: () => Promise<void> | void;
};

const createLeafletIcon = (L: any, icon: string | number) =>
	L.icon({
		iconUrl: `./images/blips/${icon}`,
		iconSize: [20, 20],
		iconAnchor: [10, 10],
		popupAnchor: [0, -10],
	});

const UpdateMarkerForm = ({ marker }: MarkerPopupProps) => {
	const form = useZodForm({
		schema: UpdateMarkerSchema,
		defaultValues: {
			markerId: marker.id,
			label: marker.label ?? "",
			icon: marker.icon ?? "default.png",
			lat: marker.lat.toString() ?? "0",
			lng: marker.lng.toString() ?? "0",
		},
	});

	const { executeAsync: updateMarker, isPending: updateMarkerPending } =
		useAction(updateMarkerAction, {
			onSuccess: () => {
				toast.success("Le marqueur a bien été modifié !");

				if (typeof window !== "undefined") {
					window.location.reload();
				}
			},
			onError: ({ error }) => {
				toast.error(error.serverError);
			},
		});

	const onSubmit = async (data: UpdateMarkerSchemaType) => {
		await updateMarker(data);
	};

	return (
		<>
			<AlertDialogHeader>
				<AlertDialogTitle>Modifier le marqueur</AlertDialogTitle>
				<AlertDialogDescription>
					Modifiez les informations du marqueur puis validez.
				</AlertDialogDescription>
			</AlertDialogHeader>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<BlipSelector form={form} fieldName="icon" />
					<FormField
						control={form.control}
						name="label"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Label</FormLabel>
								<FormControl>
									<Input {...field} placeholder="label" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="lat"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Latitude</FormLabel>
								<FormControl>
									<Input {...field} placeholder="Latitude" />
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
									<Input {...field} placeholder="Longitude" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<AlertDialogFooter>
						<AlertDialogCancel type="button">
							Retour
						</AlertDialogCancel>
						<AlertDialogAction
							disabled={updateMarkerPending}
							asChild
						>
							<LoadingButton
								loading={updateMarkerPending}
								type="submit"
							>
								Modifier
							</LoadingButton>
						</AlertDialogAction>
					</AlertDialogFooter>
				</form>
			</Form>
		</>
	);
};

const MarkerPopup = ({ marker }: MarkerPopupProps) => {
	const { data: canEditMarker } = useQuery({
		queryKey: ["marker-edit-permission"],
		queryFn: async () => {
			const { data } = await authClient.organization.hasPermission({
				permission: { marker: ["update"] },
			});

			return Boolean(data?.success);
		},
		staleTime: 5 * 60 * 1000,
	});

	const { data: canDeleteMarker } = useQuery({
		queryKey: ["marker-delete-permission"],
		queryFn: async () => {
			const { data } = await authClient.organization.hasPermission({
				permission: { marker: ["delete"] },
			});

			return Boolean(data?.success);
		},
		staleTime: 5 * 60 * 1000,
	});

	const { executeAsync: deleteMarker, isPending: deleteMarkerPending } =
		useAction(deleteMarkerAction, {
			onSuccess: () => {
				toast.success("Le marqueur a bien été supprimé !");

				if (typeof window !== "undefined") {
					window.location.reload();
				}
			},
			onError: ({ error }) => {
				toast.error(error.serverError);
			},
		});

	const [copied, setCopied] = useState(false);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(`${marker.lat}, ${marker.lng}`).then(
			() => {
				toast.success("Coordonnées copiées dans le presse-papier !");
			},
			() => {
				toast.error("Erreur lors de la copie des coordonnées.");
			}
		);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{marker.label || "Marqueur"}</CardTitle>
				<CardDescription>
					{marker.lat.toFixed(2)}, {marker.lng.toFixed(2)}
				</CardDescription>
			</CardHeader>
			<CardFooter className="gap-2 justify-end">
				<Button
					size="icon"
					onClick={() => {
						copyToClipboard();
						setCopied(true);
						setTimeout(() => setCopied(false), 700);
					}}
					className={cn(copied && "animate-bounce")}
					aria-label="Copier les coordonnées"
				>
					{copied ? <Check /> : <Copy />}
				</Button>
				{canEditMarker ? (
					<LoadingButton
						variant="secondary"
						size="icon"
						onClick={() => {
							dialog.add({
								children: <UpdateMarkerForm marker={marker} />,
							});
						}}
					>
						<Pencil />
					</LoadingButton>
				) : null}
				{canDeleteMarker ? (
					<LoadingButton
						variant="destructive"
						size="icon"
						loading={deleteMarkerPending}
						onClick={() => {
							dialog.add({
								title: "Êtes-vous sûr de vouloir supprimer ce marqueur ?",
								description:
									"Cette action est irréversible. Le marqueur sera définitivement supprimé.",
								action: {
									label: "Supprimer",
									variant: "destructive",
									onClick: async () => {
										await deleteMarker({
											markerId: marker.id,
										});
									},
								},
							});
						}}
					>
						<Trash />
					</LoadingButton>
				) : null}
			</CardFooter>
		</Card>
	);
};

export function CreateMarkerModal(props: CreateMarkerModalProps) {
	const form = useZodForm({
		schema: CreateMarkerSchema,
		defaultValues: {
			label: "",
			icon: "default.png",
			lat: props.lat,
			lng: props.lng,
			teamId: "none",
		},
	});

	useEffect(() => {
		if (!props.isOpen) return;

		form.setValue("lat", props.lat);
		form.setValue("lng", props.lng);

		if (!form.getValues("teamId")) {
			form.setValue("teamId", "none");
		}

		if (!form.getValues("icon")) {
			form.setValue("icon", "default.png");
		}
	}, [form, props.isOpen, props.lat, props.lng]);

	useEffect(() => {
		if (props.isOpen) return;

		form.reset({
			label: "",
			icon: "default.png",
			lat: "",
			lng: "",
			teamId: "none",
		});
	}, [form, props.isOpen]);

	const { executeAsync, isPending } = useAction(createMarkerAction, {
		onSuccess: async () => {
			toast.success("Le marqueur a été créé avec succès !");
			await props.onCreated();
		},
		onError: ({ error }) => {
			toast.error(error.serverError);
		},
	});

	const onSubmit = async (data: CreateMarkerSchemaType) => {
		await executeAsync(data);
	};

	return (
		<AlertDialog
			open={props.isOpen}
			onOpenChange={(open) => {
				if (!open) {
					props.onClose();
				}
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Créer un nouveau marqueur
					</AlertDialogTitle>
					<AlertDialogDescription>
						Ajoutez un marqueur à la carte en renseignant les
						informations ci-dessous.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-6"
					>
						<BlipSelector form={form} fieldName="icon" />
						<FormField
							control={form.control}
							name="label"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Label</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Nom du marqueur"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lat"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Latitude</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Latitude"
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
											placeholder="Longitude"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{props.teams.length > 0 ? (
							<FormField
								control={form.control}
								name="teamId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Equipe</FormLabel>
										<FormControl>
											<Select
												value={field.value ?? "none"}
												onValueChange={field.onChange}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Sélectionnez une équipe" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="none">
														Aucune
													</SelectItem>
													{props.teams.map((team) => (
														<SelectItem
															key={team.id}
															value={team.id}
														>
															{team.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						) : null}
						<AlertDialogFooter>
							<AlertDialogCancel type="button">
								Retour
							</AlertDialogCancel>
							<LoadingButton loading={isPending} type="submit">
								Créer
							</LoadingButton>
						</AlertDialogFooter>
					</form>
				</Form>
			</AlertDialogContent>
		</AlertDialog>
	);
}

type GTAMapProps = {
	teams: Team[];
	canCreateMarker: boolean;
};

export function GTAMap(props: GTAMapProps) {
	const mapRef = useRef<HTMLDivElement>(null);
	const mapInstanceRef = useRef<Map | null>(null);
	const temporaryMarkerRef = useRef<LeafletMarker | null>(null);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [createModalState, setCreateModalState] =
		useState<CreateMarkerModalState>({
			isOpen: false,
			lat: "",
			lng: "",
		});
	const queryClient = useQueryClient();

	const clearTemporaryMarker = useCallback(() => {
		if (temporaryMarkerRef.current && mapInstanceRef.current) {
			mapInstanceRef.current.removeLayer(temporaryMarkerRef.current);
			temporaryMarkerRef.current = null;
		}
	}, []);

	const handleCloseCreateModal = useCallback(() => {
		clearTemporaryMarker();
		setCreateModalState({ isOpen: false, lat: "", lng: "" });
	}, [clearTemporaryMarker]);

	const handleCreateSuccess = useCallback(async () => {
		await queryClient.refetchQueries({ queryKey: ["markers"] });
		handleCloseCreateModal();
	}, [handleCloseCreateModal, queryClient]);

	useEffect(() => {
		if (!props.canCreateMarker) {
			handleCloseCreateModal();
		}
	}, [handleCloseCreateModal, props.canCreateMarker]);

	const {
		data: markers,
		isPending,
		isLoading,
	} = useQuery({
		queryKey: ["markers"],
		queryFn: fetchMarkers,
	});

	useEffect(() => {
		if (typeof window === "undefined") return;

		import("leaflet").then((L) => {
			if (mapInstanceRef.current) return;

			const center_x = 117.3;
			const center_y = 172.8;
			const scale_x = 0.02072;
			const scale_y = 0.0205;

			const CUSTOM_CRS = L.extend({}, L.CRS.Simple, {
				projection: L.Projection.LonLat,
				scale: function (zoom: number) {
					return Math.pow(2, zoom);
				},
				zoom: function (sc: number) {
					return Math.log(sc) / 0.6931471805599453;
				},
				distance: function (pos1: L.LatLng, pos2: L.LatLng) {
					var x_difference = pos2.lng - pos1.lng;
					var y_difference = pos2.lat - pos1.lat;

					return Math.sqrt(
						x_difference * x_difference +
							y_difference * y_difference
					);
				},
				transformation: new L.Transformation(
					scale_x,
					center_x,
					-scale_y,
					center_y
				),
				infinite: true,
			});

			var SateliteStyle = L.tileLayer(
				"./images/mapStyles/styleSatelite/{z}/{x}/{y}.webp",
				{
					minZoom: 0,
					maxZoom: 5,
					maxNativeZoom: 5,
					noWrap: true,
					attribution: "Online map GTA V",
					id: "SateliteStyle map",
					keepBuffer: 8,
					updateWhenIdle: true,
					updateWhenZooming: false,
					updateInterval: 200,
					opacity: 1,
					className: "tile-loaded",
					errorTileUrl: "",
				}
			);

			var AtlasStyle = L.tileLayer(
				"./images/mapStyles/styleAtlas/{z}/{x}/{y}.webp",
				{
					minZoom: 0,
					maxZoom: 5,
					maxNativeZoom: 5,
					noWrap: true,
					attribution: "Online map GTA V",
					id: "styleAtlas map",
					keepBuffer: 8,
					updateWhenIdle: true,
					updateWhenZooming: false,
					updateInterval: 200,
					opacity: 1,
					className: "tile-loaded",
					errorTileUrl: "",
				}
			);

			var GridStyle = L.tileLayer(
				"./images/mapStyles/styleGrid/{z}/{x}/{y}.webp",
				{
					minZoom: 0,
					maxZoom: 5,
					maxNativeZoom: 5,
					noWrap: true,
					attribution: "Online map GTA V",
					id: "styleGrid map",
					keepBuffer: 8,
					updateWhenIdle: true,
					updateWhenZooming: false,
					updateInterval: 200,
					opacity: 1,
					className: "tile-loaded",
					errorTileUrl: "",
				}
			);

			var mymap = L.map(mapRef.current!, {
				crs: CUSTOM_CRS,
				minZoom: 1,
				maxZoom: 8,
				preferCanvas: true,
				layers: [SateliteStyle],
				center: [0, 0],
				zoom: 3,
				attributionControl: false,
				zoomControl: false,
				fadeAnimation: false,
				zoomAnimation: true,
				markerZoomAnimation: true,
				zoomSnap: 1,
				zoomDelta: 1,
			});

			mapInstanceRef.current = mymap;

			const adjustZoomForLayer = () => {
				if (!mymap) return;

				let activeTileLayer: any = null;
				mymap.eachLayer((layer: any) => {
					if (layer instanceof L.TileLayer && !activeTileLayer) {
						activeTileLayer = layer;
					}
				});

				if (activeTileLayer && activeTileLayer.options) {
					const maxZoom = activeTileLayer.options.maxZoom || 8;
					const currentZoom = mymap.getZoom();

					mymap.setMaxZoom(maxZoom);

					if (currentZoom > maxZoom) {
						mymap.setZoom(maxZoom);
					}
				}
			};

			mymap.on("baselayerchange", adjustZoomForLayer);

			mymap.on("zoomend", () => {
				const currentZoom = mymap.getZoom();
				const maxZoom = mymap.getMaxZoom();
				const minZoom = mymap.getMinZoom();

				if (currentZoom > maxZoom) {
					mymap.setZoom(maxZoom);
				} else if (currentZoom < minZoom) {
					mymap.setZoom(minZoom);
				}
			});

			adjustZoomForLayer();

			if (props.canCreateMarker) {
				mymap.on("click", (event: LeafletMouseEvent) => {
					clearTemporaryMarker();

					const placeholderMarker = L.marker(
						[event.latlng.lat, event.latlng.lng],
						{
							icon: createLeafletIcon(L, "default.png"),
						}
					);

					placeholderMarker.addTo(mymap);
					temporaryMarkerRef.current = placeholderMarker;

					setCreateModalState({
						isOpen: true,
						lat: event.latlng.lng.toFixed(4),
						lng: event.latlng.lat.toFixed(4),
					});
				});
			}

			(window as any).mapLayers = {
				Satelite: SateliteStyle,
				Atlas: AtlasStyle,
				Grid: GridStyle,
			};
			(window as any).mapInstance = mymap;
			(window as any).L = L;
		});

		return () => {
			if (mapInstanceRef.current) {
				mapInstanceRef.current.remove();
				mapInstanceRef.current = null;
			}

			clearTemporaryMarker();
		};
	}, [clearTemporaryMarker, props.canCreateMarker, setCreateModalState]);

	useEffect(() => {
		if (isFullscreen) {
			document.documentElement.requestFullscreen();
		} else {
			if (document.fullscreenElement && document.fullscreenEnabled) {
				document.exitFullscreen().catch(() => {});
			}
		}
	}, [isFullscreen]);

	useEffect(() => {
		if (
			!mapInstanceRef.current ||
			!markers ||
			markers.length === 0 ||
			typeof window === "undefined"
		)
			return;

		const L = (window as any).L;
		if (!L) return;

		mapInstanceRef.current.eachLayer((layer: any) => {
			if (layer instanceof L.Marker) {
				if (temporaryMarkerRef.current !== layer) {
					mapInstanceRef.current?.removeLayer(layer);
				}
			}
		});

		if (markers.length > 0) {
			markers.forEach((marker) => {
				const leafletMarker = L.marker([marker.lng, marker.lat], {
					icon: createLeafletIcon(L, marker.icon ?? "default.png"),
				}).addTo(mapInstanceRef.current!);

				const popupContainer = document.createElement("div");

				let root: any = null;

				leafletMarker.bindPopup(popupContainer, {
					className: "custom-leaflet-popup",
					minWidth: 200,
				});

				leafletMarker.on("popupopen", () => {
					if (!root) {
						root = createRoot(popupContainer);
					}
					root.render(
						<QueryClientProvider client={queryClient}>
							<MarkerPopup marker={marker} />
						</QueryClientProvider>
					);
				});

				leafletMarker.on("popupclose", () => {
					if (root) {
						setTimeout(() => {
							root.unmount();
							root = null;
						}, 0);
					}
				});
			});
		}
	}, [markers, queryClient]);

	const handleZoomIn = () => {
		if (!mapInstanceRef.current) return;

		const currentZoom = mapInstanceRef.current.getZoom();
		const maxZoom = mapInstanceRef.current.getMaxZoom();

		if (currentZoom < maxZoom) {
			mapInstanceRef.current.zoomIn();
		}
	};

	const handleZoomOut = () => {
		if (!mapInstanceRef.current) return;

		const currentZoom = mapInstanceRef.current.getZoom();
		const minZoom = mapInstanceRef.current.getMinZoom();

		if (currentZoom > minZoom) {
			mapInstanceRef.current.zoomOut();
		}
	};

	return (
		<div className="size-full relative">
			<style jsx global>{`
				.custom-leaflet-popup .leaflet-popup-content-wrapper {
					background-color: hsl(var(--popover));
					color: hsl(var(--popover-foreground));
					border: 1px solid hsl(var(--border));
					border-radius: var(--radius);
					box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
					padding: 0;
				}

				.custom-leaflet-popup .leaflet-popup-content {
					margin: 0;
					min-width: 200px;
				}

				.custom-leaflet-popup .leaflet-popup-tip {
					background-color: hsl(var(--popover));
					border: 1px solid hsl(var(--border));
				}

				.custom-leaflet-popup a.leaflet-popup-close-button {
					color: hsl(var(--foreground));
					opacity: 0.5;
				}

				.custom-leaflet-popup a.leaflet-popup-close-button:hover {
					opacity: 1;
				}
			`}</style>
			<div
				ref={mapRef}
				className="size-full z-10 rounded-lg"
				style={{ backgroundColor: "#000" }}
			/>
			<ButtonGroup
				orientation="vertical"
				className="h-fit bottom-2 right-2 absolute z-50"
			>
				<LayerSelector />
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="secondary"
							size="icon"
							onClick={() => setIsFullscreen(!isFullscreen)}
						>
							<Fullscreen />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="left">Plein écran</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="secondary"
							size="icon"
							onClick={handleZoomIn}
						>
							<ZoomIn />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="left">Agrandir</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="secondary"
							size="icon"
							onClick={handleZoomOut}
						>
							<ZoomOut />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="left">Réduire</TooltipContent>
				</Tooltip>
			</ButtonGroup>
			{isPending || isLoading ? (
				<div className="absolute top-0 left-0 size-full z-50 flex items-center justify-center bg-black/75 rounded-lg">
					<Loader />
				</div>
			) : null}
			{props.canCreateMarker ? (
				<CreateMarkerModal
					teams={props.teams}
					isOpen={createModalState.isOpen}
					lat={createModalState.lat}
					lng={createModalState.lng}
					onClose={handleCloseCreateModal}
					onCreated={handleCreateSuccess}
				/>
			) : null}
		</div>
	);
}
