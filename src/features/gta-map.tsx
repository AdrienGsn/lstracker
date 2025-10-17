"use client";

import type { Map } from "leaflet";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useEffect, useRef } from "react";

import "leaflet/dist/leaflet.css";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Loader } from "@/components/ui/loader";
import { Marker } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Fantome } from "./fantome";

const fetchMarkers = async () => {
	const response = await fetch("/api/markers");
	if (!response.ok) {
		throw new Error("Erreur lors de la récupération des marqueurs");
	}
	return response.json() as Promise<Marker[]>;
};

export const GTAMap = () => {
	const mapRef = useRef<HTMLDivElement>(null);
	const mapInstanceRef = useRef<Map | null>(null);
	// const [currentLayer, setCurrentLayer] = useState("Satelite");
	// const [showLayers, setShowLayers] = useState(false);

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
					maxZoom: 8,
					noWrap: true,
					attribution: "Online map GTA V",
					id: "SateliteStyle map",
					keepBuffer: 8,
					updateWhenIdle: true,
					updateWhenZooming: false,
					updateInterval: 200,
					opacity: 1,
					className: "tile-loaded",
				}
			);

			var AtlasStyle = L.tileLayer(
				"./images/mapStyles/styleAtlas/{z}/{x}/{y}.webp",
				{
					minZoom: 0,
					maxZoom: 5,
					noWrap: true,
					attribution: "Online map GTA V",
					id: "styleAtlas map",
					keepBuffer: 8,
					updateWhenIdle: true,
					updateWhenZooming: false,
					updateInterval: 200,
					opacity: 1,
					className: "tile-loaded",
				}
			);

			var GridStyle = L.tileLayer(
				"./images/mapStyles/styleGrid/{z}/{x}/{y}.webp",
				{
					minZoom: 0,
					maxZoom: 5,
					noWrap: true,
					attribution: "Online map GTA V",
					id: "styleGrid map",
					keepBuffer: 8,
					updateWhenIdle: true,
					updateWhenZooming: false,
					updateInterval: 200,
					opacity: 1,
					className: "tile-loaded",
				}
			);

			var mymap = L.map(mapRef.current!, {
				crs: CUSTOM_CRS,
				minZoom: 1,
				maxZoom: 5,
				preferCanvas: true,
				layers: [SateliteStyle],
				center: [0, 0],
				zoom: 3,
				attributionControl: false,
				zoomControl: false,
				fadeAnimation: false,
				zoomAnimation: true,
				markerZoomAnimation: true,
			});

			mapInstanceRef.current = mymap;

			(window as any).mapLayers = {
				Satelite: SateliteStyle,
				Atlas: AtlasStyle,
				Grid: GridStyle,
			};
			(window as any).mapInstance = mymap;
			(window as any).L = L; // Stocker L dans window pour y accéder plus tard
		});

		return () => {
			if (mapInstanceRef.current) {
				mapInstanceRef.current.remove();
				mapInstanceRef.current = null;
			}
		};
	}, []);

	useEffect(() => {
		if (
			!mapInstanceRef.current ||
			!markers ||
			typeof window === "undefined"
		)
			return;

		const L = (window as any).L;
		if (!L) return;

		function customIcon(icon: string | number) {
			return L.icon({
				iconUrl: `./images/blips/${icon}.png`,
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

		markers.forEach((marker) => {
			L.marker([marker.lng, marker.lat], { icon: customIcon(1) })
				.addTo(mapInstanceRef.current!)
				.bindPopup(
					marker.label
						? `${marker.label} ${marker.lat.toFixed(
								2
						  )}, ${marker.lng.toFixed(2)}`
						: `Marqueur à: ${marker.lat.toFixed(
								2
						  )}, ${marker.lng.toFixed(2)}`
				);
		});
	}, [markers]);

	const handleZoomIn = () => {
		if (mapInstanceRef.current) {
			mapInstanceRef.current.zoomIn();
		}
	};

	const handleZoomOut = () => {
		if (mapInstanceRef.current) {
			mapInstanceRef.current.zoomOut();
		}
	};

	// const handleLayerChange = (layerName: string) => {
	// 	if (mapInstanceRef.current && (window as any).mapLayers) {
	// 		Object.values((window as any).mapLayers).forEach((layer: any) => {
	// 			mapInstanceRef.current?.removeLayer(layer);
	// 		});

	// 		const newLayer = (window as any).mapLayers[layerName];

	// 		if (newLayer) {
	// 			mapInstanceRef.current.addLayer(newLayer);
	// 			setCurrentLayer(layerName);
	// 		}
	// 	}
	// };

	return (
		<div className="size-full relative">
			<div
				ref={mapRef}
				className="size-full z-10"
				style={{ backgroundColor: "#000" }}
			/>
			<Fantome />
			<ButtonGroup
				orientation="vertical"
				className="h-fit bottom-2 right-2 absolute z-50"
			>
				<Button variant="secondary" size="icon" onClick={handleZoomIn}>
					<PlusIcon />
				</Button>
				<Button variant="secondary" size="icon" onClick={handleZoomOut}>
					<MinusIcon />
				</Button>
			</ButtonGroup>
			{isPending || isLoading ? (
				<div className="absolute top-0 left-0 size-full z-50 flex items-center justify-center bg-black/75">
					<Loader />
				</div>
			) : null}
		</div>
	);
};
