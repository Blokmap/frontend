import Supercluster from 'supercluster';
import { ref } from 'vue';
import type {
    ClusterData,
    ClusteringAdapter,
    LngLat,
    LngLatBounds,
    MapOptions,
} from '@/domain/map';

/**
 * Composable to handle marker clustering using Supercluster.
 *
 * @param options - Map options containing clustering configuration.
 * @returns An adapter with clustering methods and state.
 */
export function useClustering<T = number>(options: MapOptions): ClusteringAdapter<T> {
    const clusterIndex = new Supercluster({
        radius: options.clusterRadius || 25,
        maxZoom: options.clusterMaxZoom || 12,
    });

    // Maps stable composite IDs to Supercluster numeric IDs
    const clusterIdMap = new Map<string, number>();
    const currentClusters = ref<ClusterData[]>([]);
    const isLoaded = ref<boolean>(false);

    const updateClusters = (bounds: LngLatBounds, zoom: number): void => {
        if (!isLoaded.value) {
            currentClusters.value = [];
            return;
        }

        const clusters = clusterIndex.getClusters(
            [bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1]],
            Math.floor(zoom),
        );

        const newClusters: ClusterData[] = [];

        clusterIdMap.clear();

        clusters.forEach((cluster) => {
            if (cluster.properties.cluster && cluster.id !== undefined) {
                const leaves = clusterIndex.getLeaves(cluster.id as number, Infinity);

                const markerIds = leaves
                    .map((leaf) => leaf.properties.id as number)
                    .sort((a, b) => a - b);

                // Create stable ID based on marker composition
                const clusterId = `cluster-${markerIds.join('-')}`;
                clusterIdMap.set(clusterId, cluster.id as number);

                newClusters.push({
                    id: clusterId,
                    position: cluster.geometry.coordinates as LngLat,
                    count: cluster.properties.point_count,
                    markers: markerIds,
                });
            }
        });

        currentClusters.value = newClusters;
    };

    const loadMarkers = (
        features: Array<{ id: T; coord: LngLat; properties?: Record<string, any> }>,
        bounds: LngLatBounds,
        zoom: number,
    ): void => {
        if (!features || features.length === 0) {
            isLoaded.value = false;
            currentClusters.value = [];
            clusterIdMap.clear();
            return;
        }

        // Convert to GeoJSON features for supercluster
        const points = features.map((feature) => ({
            type: 'Feature' as const,
            geometry: {
                type: 'Point' as const,
                coordinates: feature.coord,
            },
            properties: {
                id: feature.id,
                ...feature.properties,
            },
        }));

        try {
            clusterIndex.load(points);
            isLoaded.value = true;
            updateClusters(bounds, zoom);
        } catch (error) {
            console.error('Error loading markers into cluster index:', error);
            isLoaded.value = false;
            currentClusters.value = [];
            clusterIdMap.clear();
        }
    };

    const getClusters = (): ClusterData[] => {
        return currentClusters.value;
    };

    const getExpansionZoom = (clusterId: string): number | null => {
        const numericId = clusterIdMap.get(clusterId);
        if (numericId === undefined) {
            return null;
        }
        return clusterIndex.getClusterExpansionZoom(numericId);
    };

    return {
        updateClusters,
        loadMarkers,
        getClusters,
        getExpansionZoom,
    };
}
