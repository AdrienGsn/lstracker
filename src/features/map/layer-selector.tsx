"use client";

import type { Map as LeafletMap, TileLayer } from "leaflet";
import { Layers } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

type MapLayerId = "Satelite" | "Atlas" | "Grid";

type LayerOptionType = {
	id: MapLayerId;
	label: string;
	description: string;
};

const LAYER_STORAGE_KEY = "map-layer";

const LAYER_OPTIONS = [
	{
		id: "Satelite",
		label: "Satellite",
		description: "Fond photo réaliste avec relief détaillé.",
	},
	{
		id: "Atlas",
		label: "Atlas",
		description: "Vue cartographique avec repères urbains.",
	},
	{
		id: "Grid",
		label: "Quadrillage",
		description: "Mode grille pour des mesures précises.",
	},
] as const satisfies readonly LayerOptionType[];

type MapWindow = Window & {
	mapInstance?: LeafletMap;
	mapLayers?: Partial<Record<MapLayerId, TileLayer>>;
};

const isMapLayerId = (value: string | null): value is MapLayerId => {
	return value === "Satelite" || value === "Atlas" || value === "Grid";
};

const getMapWindow = () => {
	if (typeof window === "undefined") return null;

	return window as MapWindow;
};

const determineActiveLayer = (mapWindow: MapWindow) => {
	const { mapInstance, mapLayers } = mapWindow;

	if (!mapInstance || !mapLayers) return null;

	const entries = Object.entries(mapLayers) as [MapLayerId, TileLayer][];
	const activeEntry = entries.find(([, layer]) =>
		mapInstance.hasLayer(layer)
	);

	return activeEntry?.[0] ?? null;
};

const removeActiveLayers = (mapInstance: LeafletMap, mapWindow: MapWindow) => {
	const { mapLayers } = mapWindow;

	if (!mapLayers) return;

	Object.values(mapLayers)
		.filter((layer): layer is TileLayer => Boolean(layer))
		.forEach((layer) => {
			if (mapInstance.hasLayer(layer)) {
				mapInstance.removeLayer(layer);
			}
		});
};

export const LayerSelector = () => {
	const [selectedLayer, setSelectedLayer] = useState<MapLayerId>("Satelite");
	const [availableLayers, setAvailableLayers] = useState<MapLayerId[]>([]);
	const [isMapReady, setIsMapReady] = useState(false);

	const readStoredLayer = () => {
		if (typeof window === "undefined") return null;

		const storedLayer = window.localStorage.getItem(LAYER_STORAGE_KEY);

		return isMapLayerId(storedLayer) ? storedLayer : null;
	};

	const persistLayerSelection = (layerId: MapLayerId) => {
		if (typeof window === "undefined") return;

		window.localStorage.setItem(LAYER_STORAGE_KEY, layerId);
	};

	useEffect(() => {
		const mapWindow = getMapWindow();

		if (!mapWindow) return;

		const hydrateFromWindow = () => {
			const nextAvailable = Object.keys(
				mapWindow.mapLayers ?? {}
			) as MapLayerId[];

			if (nextAvailable.length) {
				setAvailableLayers(nextAvailable);
			}

			const storedLayer = readStoredLayer();

			if (
				storedLayer &&
				nextAvailable.includes(storedLayer) &&
				mapWindow.mapLayers?.[storedLayer]
			) {
				handleLayerChange(storedLayer);

				setIsMapReady(true);

				return;
			}

			const activeLayer = determineActiveLayer(mapWindow);

			if (activeLayer) {
				setSelectedLayer(activeLayer);
			}

			setIsMapReady(
				Boolean(mapWindow.mapInstance && nextAvailable.length)
			);
		};

		if (mapWindow.mapLayers && mapWindow.mapInstance) {
			hydrateFromWindow();

			return;
		}

		const intervalId = window.setInterval(() => {
			if (mapWindow.mapLayers && mapWindow.mapInstance) {
				window.clearInterval(intervalId);

				hydrateFromWindow();
			}
		}, 300);

		return () => {
			window.clearInterval(intervalId);
		};
	}, []);

	const handleLayerChange = (layerId: MapLayerId) => {
		const mapWindow = getMapWindow();

		if (!mapWindow) return;

		const mapInstance = mapWindow.mapInstance;
		const nextLayer = mapWindow.mapLayers?.[layerId];

		if (!mapInstance || !nextLayer) return;

		removeActiveLayers(mapInstance, mapWindow);

		nextLayer.addTo(mapInstance);

		mapInstance.fire("baselayerchange", { layer: nextLayer });

		setSelectedLayer(layerId);

		persistLayerSelection(layerId);
	};

	return (
		<DropdownMenu>
			<Tooltip>
				<TooltipTrigger asChild>
					<DropdownMenuTrigger asChild>
						<Button variant="secondary" size="icon">
							<Layers />
						</Button>
					</DropdownMenuTrigger>
				</TooltipTrigger>
				<TooltipContent side="left">
					Changer le style de carte
				</TooltipContent>
			</Tooltip>
			<DropdownMenuContent side="left" className="min-w-[220px]">
				<DropdownMenuLabel>Style de carte</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{isMapReady ? (
					<DropdownMenuRadioGroup
						value={selectedLayer}
						onValueChange={(value) =>
							handleLayerChange(value as MapLayerId)
						}
					>
						{LAYER_OPTIONS.map((option) => (
							<DropdownMenuRadioItem
								key={option.id}
								value={option.id}
								disabled={!availableLayers.includes(option.id)}
							>
								<div className="flex flex-col gap-0.5">
									<span className="text-sm font-medium">
										{option.label}
									</span>
									<span className="text-xs text-muted-foreground">
										{option.description}
									</span>
								</div>
							</DropdownMenuRadioItem>
						))}
					</DropdownMenuRadioGroup>
				) : (
					<p className="text-sm text-muted-foreground px-2 py-1.5">
						Chargement des layers...
					</p>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
