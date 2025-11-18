"use client";

import { Marker, Team } from "@prisma/client";
import {
	QueryClientProvider,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import type {
	Map as LeafletMap,
	Marker as LeafletMarker,
	LeafletMouseEvent,
} from "leaflet";
import { Fullscreen, ZoomIn, ZoomOut } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import "leaflet/dist/leaflet.css";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Loader } from "@/components/ui/loader";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCurrentUser } from "@/hooks/use-current-user";
import { authClient } from "@/lib/auth/client";
import { LayerSelector } from "../layer-selector";
import { CreateMarkerModal } from "./create-marker-modal";
import { MarkerPopup } from "./marker-popup";

const fetchMarkers = async () => {
	const response = await fetch("/api/markers");

	if (!response.ok) {
		throw new Error("Erreur lors de la récupération des marqueurs");
	}

	return response.json() as Promise<Marker[]>;
};

type CreateMarkerModalState = {
	isOpen: boolean;
	lat: string;
	lng: string;
};

const createLeafletIcon = (L: any, icon: string | number) =>
	L.icon({
		iconUrl: `./images/blips/${icon}`,
		iconSize: [20, 20],
		iconAnchor: [10, 10],
		popupAnchor: [0, -10],
	});

type GTAMapProps = {
	teams: Team[];
	canCreateMarker: boolean;
};

export function GTAMap(props: GTAMapProps) {
	const mapRef = useRef<HTMLDivElement>(null);
	const mapInstanceRef = useRef<LeafletMap | null>(null);
	const temporaryMarkerRef = useRef<LeafletMarker | null>(null);
	const markersRef = useRef<globalThis.Map<string, LeafletMarker>>(
		new globalThis.Map()
	);
	const hasAppliedInitialUrlParams = useRef(false);
	const lastAppliedMarkerId = useRef<string | null>(null);
	const isManualPopupOpen = useRef(false);
	const lastProcessedMarkerForTeam = useRef<string | null>(null);

	const { session } = useCurrentUser();
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [createModalState, setCreateModalState] =
		useState<CreateMarkerModalState>({
			isOpen: false,
			lat: "",
			lng: "",
		});
	const [marker, setMarker] = useQueryState("marker", parseAsString);

	const teamsIds = useMemo(
		() => props.teams.map((team) => team.id),
		[props.teams]
	);

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

		markersRef.current.clear();

		if (markers.length > 0) {
			markers.forEach((_marker) => {
				const leafletMarker = L.marker([_marker.lng, _marker.lat], {
					icon: createLeafletIcon(L, _marker.icon ?? "default.png"),
				}).addTo(mapInstanceRef.current!);

				markersRef.current.set(_marker.id, leafletMarker);

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

					isManualPopupOpen.current = true;

					root.render(
						<QueryClientProvider client={queryClient}>
							<MarkerPopup marker={_marker} />
						</QueryClientProvider>
					);
				});

				leafletMarker.on("popupclose", () => {
					if (root) {
						lastAppliedMarkerId.current = null;

						setMarker(null);

						setTimeout(() => {
							root.unmount();

							root = null;
						}, 0);
					}
				});
			});
		}
	}, [markers, queryClient, setMarker]);

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

		const targetMarker = marker
			? markers.find((m) => m.id === marker)
			: null;

		const shouldApply =
			!hasAppliedInitialUrlParams.current ||
			(marker !== null && marker !== lastAppliedMarkerId.current);

		if (!shouldApply) return;

		if (isManualPopupOpen.current && targetMarker) {
			lastAppliedMarkerId.current = targetMarker.id;

			isManualPopupOpen.current = false;

			return;
		}

		if (targetMarker) {
			const leafletMarker = markersRef.current.get(targetMarker.id);

			if (leafletMarker) {
				const targetLat = targetMarker.lat;
				const targetLng = targetMarker.lng;

				mapInstanceRef.current.setView([targetLng, targetLat], 0, {
					animate: true,
				});

				const maxZoom = mapInstanceRef.current.getMaxZoom();

				mapInstanceRef.current.setZoom(maxZoom, {
					animate: true,
				});

				setTimeout(() => {
					if (leafletMarker && !leafletMarker.isPopupOpen()) {
						leafletMarker.openPopup();
					}

					hasAppliedInitialUrlParams.current = true;
					lastAppliedMarkerId.current = targetMarker.id;
				}, 300);
			} else {
				hasAppliedInitialUrlParams.current = true;
				lastAppliedMarkerId.current = targetMarker.id;
			}
		} else if (!hasAppliedInitialUrlParams.current) {
			hasAppliedInitialUrlParams.current = true;
		}
	}, [marker, markers]);

	useEffect(() => {
		if (!marker || !markers || markers.length === 0) {
			return;
		}

		if (!session) {
			return;
		}

		let targetMarker = markers.find((m) => m.id === marker);

		if (!targetMarker && marker) {
			fetch(`/api/markers/${marker}`)
				.then((res) => {
					if (!res.ok) {
						return null;
					}

					return res.json();
				})
				.then((markerData: Marker | null) => {
					if (!markerData) {
						return;
					}

					if (!markerData.teamId) {
						lastProcessedMarkerForTeam.current = marker;

						return;
					}

					const hasAccessToTeam = teamsIds.includes(
						markerData.teamId
					);
					const isTeamDifferent =
						session.activeTeamId !== markerData.teamId;

					if (hasAccessToTeam && isTeamDifferent) {
						const setActiveTeam = async () => {
							try {
								await authClient.organization.setActiveTeam({
									teamId: markerData.teamId,
								});

								lastProcessedMarkerForTeam.current = marker;

								queryClient.refetchQueries({
									queryKey: ["markers"],
								});

								window.location.reload();
							} catch (error) {}
						};

						setActiveTeam();
					} else {
						lastProcessedMarkerForTeam.current = marker;
					}
				});

			return;
		}

		if (!targetMarker) {
			return;
		}

		if (!targetMarker.teamId) {
			lastProcessedMarkerForTeam.current = marker;

			return;
		}

		const hasAccessToTeam = teamsIds.includes(targetMarker.teamId);
		const isTeamDifferent = session.activeTeamId !== targetMarker.teamId;

		if (lastProcessedMarkerForTeam.current === marker && !isTeamDifferent) {
			return;
		}

		if (hasAccessToTeam && isTeamDifferent) {
			const setActiveTeam = async () => {
				try {
					await authClient.organization.setActiveTeam({
						teamId: targetMarker.teamId,
					});

					lastProcessedMarkerForTeam.current = marker;

					window.location.reload();
				} catch (error) {}
			};

			setActiveTeam();
		} else {
			lastProcessedMarkerForTeam.current = marker;
		}
	}, [marker, markers, teamsIds, session]);

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
