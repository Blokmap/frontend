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
        radius: options.clusterRadius || 50,
        maxZoom: options.clusterMaxZoom || 14,
    });

    const currentClusters = ref<ClusterData[]>([]);

    /**
     * Update clusters based on current map bounds and zoom.
     *
     * @param bounds - The current map bounds.
     * @param zoom - The current zoom level.
     */
    function updateClusters(bounds: LngLatBounds, zoom: number): void {
        const zoomLevel = Math.floor(zoom);

        const clusters = clusterIndex.getClusters(
            [bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1]],
            zoomLevel,
        );

        const newClusters: ClusterData[] = [];

        clusters.forEach((cluster) => {
            if (cluster.properties.cluster) {
                // It's a cluster
                const clusterId = `cluster-${cluster.id}`;
                const leaves = clusterIndex.getLeaves(cluster.id as number, Infinity);

                newClusters.push({
                    id: clusterId,
                    position: cluster.geometry.coordinates as LngLat,
                    count: cluster.properties.point_count,
                    markers: leaves.map((leaf) => leaf.properties.id as number),
                });
            }
        });

        currentClusters.value = newClusters;
    }

    /**
     * Load markers and immediately update clusters.
     *
     * @param features - Array of features with id, coordinates, and optional properties.
     * @param bounds - Current map bounds.
     * @param zoom - Current zoom level.
     */
    function loadMarkers(
        features: Array<{ id: T; coord: LngLat; properties?: Record<string, any> }>,
        bounds: LngLatBounds,
        zoom: number,
    ): void {
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

        clusterIndex.load(points);

        // Immediately update clusters
        updateClusters(bounds, zoom);
    }

    /**
     * Get current clusters.
     *
     * @returns Array of cluster data.
     */
    function getClusters(): ClusterData[] {
        return currentClusters.value;
    }

    /**
     * Get the expansion zoom level for a cluster.
     *
     * @param clusterId - The cluster ID to get expansion zoom for.
     * @returns The expansion zoom level or null if not found.
     */
    function getExpansionZoom(clusterId: string): number | null {
        const clusterNumericId = parseInt(clusterId.replace('cluster-', ''));
        return clusterIndex.getClusterExpansionZoom(clusterNumericId);
    }

    return {
        updateClusters,
        loadMarkers,
        getClusters,
        getExpansionZoom,
    };
}
