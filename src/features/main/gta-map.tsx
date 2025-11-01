"use client";

import type { Map } from "leaflet";
import { Fullscreen, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import "leaflet/dist/leaflet.css";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Loader } from "@/components/ui/loader";
import { Marker } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

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
					maxZoom: 8,
					maxNativeZoom: 8,
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
					maxZoom: 8,
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
				}
			);

			var GridStyle = L.tileLayer(
				"./images/mapStyles/styleGrid/{z}/{x}/{y}.webp",
				{
					minZoom: 0,
					maxZoom: 8,
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
			});

			mapInstanceRef.current = mymap;

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

	const calculateDistance = (
		point1: { lat: number; lng: number },
		point2: { lat: number; lng: number }
	) => {
		const dx = point2.lng - point1.lng;
		const dy = point2.lat - point1.lat;
		return Math.sqrt(dx * dx + dy * dy);
	};

	// Fonction pour calculer le chemin optimal avec 2-opt amélioration
	const calculateOptimalPath = (markers: Marker[]) => {
		if (markers.length <= 1) return markers;

		// Étape 1: Algorithme du plus proche voisin
		const visited = new Set<number>();
		const path: Marker[] = [];
		let currentIndex = 0;
		path.push(markers[0]);
		visited.add(0);

		while (visited.size < markers.length) {
			let nearestIndex = -1;
			let nearestDistance = Infinity;

			for (let i = 0; i < markers.length; i++) {
				if (!visited.has(i)) {
					const distance = calculateDistance(
						{
							lat: markers[currentIndex].lat,
							lng: markers[currentIndex].lng,
						},
						{ lat: markers[i].lat, lng: markers[i].lng }
					);
					if (distance < nearestDistance) {
						nearestDistance = distance;
						nearestIndex = i;
					}
				}
			}

			if (nearestIndex !== -1) {
				path.push(markers[nearestIndex]);
				visited.add(nearestIndex);
				currentIndex = nearestIndex;
			}
		}

		// Étape 2: Optimisation 2-opt pour améliorer le chemin
		let improved = true;
		let optimizedPath = [...path];

		while (improved) {
			improved = false;
			for (let i = 0; i < optimizedPath.length - 2; i++) {
				for (let j = i + 2; j < optimizedPath.length; j++) {
					const before =
						calculateDistance(
							{
								lat: optimizedPath[i].lat,
								lng: optimizedPath[i].lng,
							},
							{
								lat: optimizedPath[i + 1].lat,
								lng: optimizedPath[i + 1].lng,
							}
						) +
						calculateDistance(
							{
								lat: optimizedPath[j].lat,
								lng: optimizedPath[j].lng,
							},
							{
								lat: optimizedPath[
									(j + 1) % optimizedPath.length
								].lat,
								lng: optimizedPath[
									(j + 1) % optimizedPath.length
								].lng,
							}
						);

					const after =
						calculateDistance(
							{
								lat: optimizedPath[i].lat,
								lng: optimizedPath[i].lng,
							},
							{
								lat: optimizedPath[j].lat,
								lng: optimizedPath[j].lng,
							}
						) +
						calculateDistance(
							{
								lat: optimizedPath[i + 1].lat,
								lng: optimizedPath[i + 1].lng,
							},
							{
								lat: optimizedPath[
									(j + 1) % optimizedPath.length
								].lat,
								lng: optimizedPath[
									(j + 1) % optimizedPath.length
								].lng,
							}
						);

					if (after < before) {
						const newPath = [
							...optimizedPath.slice(0, i + 1),
							...optimizedPath.slice(i + 1, j + 1).reverse(),
							...optimizedPath.slice(j + 1),
						];
						optimizedPath = newPath;
						improved = true;
					}
				}
			}
		}

		return optimizedPath;
	};

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

		// Supprimer tous les marqueurs et polylines existants
		mapInstanceRef.current.eachLayer((layer: any) => {
			if (layer instanceof L.Marker || layer instanceof L.Polyline) {
				mapInstanceRef.current?.removeLayer(layer);
			}
		});

		// Calculer le chemin optimal
		const optimalPath = calculateOptimalPath(markers);

		// Dessiner la trajectoire
		if (optimalPath.length > 1) {
			const trajectoryPoints = optimalPath.map(
				(marker) => [marker.lng, marker.lat] as [number, number]
			);

			const trajectory = L.polyline(trajectoryPoints, {
				color: "#FFFF00", // Jaune clair flash
				weight: 2,
				opacity: 0.8, // 80% d'opacité
				smoothFactor: 1,
				className: "trajectory-line",
			}).addTo(mapInstanceRef.current!);
		}

		// Ajouter les marqueurs
		markers.forEach((marker) => {
			L.marker([marker.lng, marker.lat], {
				icon: customIcon("radar_pickup_ghost"),
			})
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
