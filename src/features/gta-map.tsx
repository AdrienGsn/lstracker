"use client";

import type { Map } from "leaflet";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import "leaflet/dist/leaflet.css";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Marker } from "@/generated/prisma";

export type GTAMapProps = {
	markers: Marker[];
};

export const GTAMap = (props: GTAMapProps) => {
	const mapRef = useRef<HTMLDivElement>(null);
	const mapInstanceRef = useRef<Map | null>(null);
	const [currentLayer, setCurrentLayer] = useState("Satelite");
	const [showLayers, setShowLayers] = useState(false);

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
				"./images/mapStyles/styleSatelite/{z}/{x}/{y}.jpg",
				{
					minZoom: 0,
					maxZoom: 8,
					noWrap: true,
					attribution: "Online map GTA V",
					id: "SateliteStyle map",
				}
			);

			var AtlasStyle = L.tileLayer(
				"./images/mapStyles/styleAtlas/{z}/{x}/{y}.jpg",
				{
					minZoom: 0,
					maxZoom: 5,
					noWrap: true,
					attribution: "Online map GTA V",
					id: "styleAtlas map",
				}
			);

			var GridStyle = L.tileLayer(
				"./images/mapStyles/styleGrid/{z}/{x}/{y}.png",
				{
					minZoom: 0,
					maxZoom: 5,
					noWrap: true,
					attribution: "Online map GTA V",
					id: "styleGrid map",
				}
			);

			var ExampleGroup = L.layerGroup();

			var Icons = {
				Example: ExampleGroup,
			};

			var mymap = L.map(mapRef.current!, {
				crs: CUSTOM_CRS,
				minZoom: 1,
				maxZoom: 5,
				preferCanvas: true,
				layers: [SateliteStyle],
				center: [0, 0],
				zoom: 3,
				zoomControl: false,
				attributionControl: false,
			});

			mapInstanceRef.current = mymap;

			(window as any).mapLayers = {
				Satelite: SateliteStyle,
				Atlas: AtlasStyle,
				Grid: GridStyle,
			};
			(window as any).mapInstance = mymap;

			function customIcon(icon: string | number) {
				return L.icon({
					iconUrl: `./images/blips/${icon}.png`,
					iconSize: [20, 20],
					iconAnchor: [10, 10], // Centre de l'icône (la moitié de la taille)
					popupAnchor: [0, -10], // Au-dessus du marqueur
				});
			}

			props.markers.map((marker) => {
				L.marker([marker.lng, marker.lat], { icon: customIcon(1) })
					.addTo(mymap)
					.bindPopup(
						marker.label ??
							`Marqueur à: ${marker.lat.toFixed(
								2
							)}, ${marker.lng.toFixed(2)}`
					);
			});

			// Ajouter un gestionnaire d'événement pour créer des marqueurs en cliquant
			// mymap.on("click", function (e) {
			// 	const lat = e.latlng.lat;
			// 	const lng = e.latlng.lng;

			// 	// Créer un nouveau marqueur à la position cliquée
			// 	const newMarker = L.marker([lat, lng], { icon: customIcon(1) })
			// 		.addTo(mymap)
			// 		.bindPopup(
			// 			`Marqueur à: ${lat.toFixed(2)}, ${lng.toFixed(2)}`
			// 		);

			// 	// Ouvrir automatiquement le popup du nouveau marqueur
			// 	newMarker.openPopup();
			// });
		});

		return () => {
			if (mapInstanceRef.current) {
				mapInstanceRef.current.remove();

				mapInstanceRef.current = null;
			}
		};
	}, []);

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

	const handleLayerChange = (layerName: string) => {
		if (mapInstanceRef.current && (window as any).mapLayers) {
			Object.values((window as any).mapLayers).forEach((layer: any) => {
				mapInstanceRef.current?.removeLayer(layer);
			});

			const newLayer = (window as any).mapLayers[layerName];

			if (newLayer) {
				mapInstanceRef.current.addLayer(newLayer);
				setCurrentLayer(layerName);
			}
		}
	};

	return (
		<div className="size-full relative">
			<div ref={mapRef} className="size-full z-10" />
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
		</div>
	);
};
