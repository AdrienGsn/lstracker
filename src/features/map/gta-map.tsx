"use client";

import { Marker } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import type { Map } from "leaflet";
import { Copy, Fullscreen, Pencil, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import "leaflet/dist/leaflet.css";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { authClient } from "@/lib/auth/client";

const fetchMarkers = async () => {
	const response = await fetch("/api/markers");

	if (!response.ok) {
		throw new Error("Erreur lors de la récupération des marqueurs");
	}

	return response.json() as Promise<Marker[]>;
};

const MarkerPopup = ({ marker }: { marker: Marker }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{marker.label || "Marqueur"}</CardTitle>
				<CardDescription>
					{marker.lat.toFixed(2)}, {marker.lng.toFixed(2)}
				</CardDescription>
			</CardHeader>
			<CardFooter className="gap-2 justify-end">
				{authClient.organization.checkRolePermission({
					role: "admin",
					permission: { marker: ["update"] },
				})}
				<Button variant="secondary" size="icon">
					<Pencil />
				</Button>
				<Button size="icon">
					<Copy />
				</Button>
			</CardFooter>
		</Card>
	);
};

export const GTAMap = () => {
	const mapRef = useRef<HTMLDivElement>(null);
	const mapInstanceRef = useRef<Map | null>(null);
	const [isFullscreen, setIsFullscreen] = useState(false);

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

			// Fonction pour ajuster le zoom selon la couche active
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

					// Ajuster le maxZoom de la carte
					mymap.setMaxZoom(maxZoom);

					// Si le zoom actuel dépasse le maxZoom de la couche, réduire le zoom
					if (currentZoom > maxZoom) {
						mymap.setZoom(maxZoom);
					}
				}
			};

			// Écouter les changements de couches
			mymap.on("baselayerchange", adjustZoomForLayer);

			// Écouter les événements de zoom pour s'assurer qu'on ne dépasse pas les limites
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

			// Ajuster le zoom initial
			adjustZoomForLayer();

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
		};
	}, []);

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

		function customIcon(icon: string | number) {
			return L.icon({
				iconUrl: `./images/blips/${icon}`,
				iconSize: [20, 20],
				iconAnchor: [10, 10],
				popupAnchor: [0, -10],
			});
		}

		mapInstanceRef.current.eachLayer((layer: any) => {
			if (layer instanceof L.Marker) {
				mapInstanceRef.current?.removeLayer(layer);
			}
		});

		if (markers.length > 0) {
			markers.map((marker) => {
				const leafletMarker = L.marker([marker.lng, marker.lat], {
					icon: customIcon(marker.icon),
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
					root.render(<MarkerPopup marker={marker} />);
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
	}, [markers]);

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
				<Button
					variant="secondary"
					size="icon"
					onClick={() => setIsFullscreen(!isFullscreen)}
				>
					<Fullscreen />
				</Button>
				<Button variant="secondary" size="icon" onClick={handleZoomIn}>
					<ZoomIn />
				</Button>
				<Button variant="secondary" size="icon" onClick={handleZoomOut}>
					<ZoomOut />
				</Button>
			</ButtonGroup>
			{isPending || isLoading ? (
				<div className="absolute top-0 left-0 size-full z-50 flex items-center justify-center bg-black/75 rounded-lg">
					<Loader />
				</div>
			) : null}
		</div>
	);
};
