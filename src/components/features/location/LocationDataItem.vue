<script lang="ts" setup>
import Badge from 'primevue/badge';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { formatLocationAddress, getLocationPlaceholderImage } from '@/domain/location';
import LocationActionsMenu from './LocationActionsMenu.vue';
import LocationLanguagesList from './details/LocationLanguagesList.vue';
import LocationStateBadge from './details/LocationStateBadge.vue';
import type { Location, LocationState } from '@/domain/location';

const props = withDefaults(
    defineProps<{
        location: Location;
        actionIsPending?: boolean;
        deleteIsPending?: boolean;
        showStatusChange?: boolean;
    }>(),
    {
        showStatusChange: true,
    },
);

const emit = defineEmits<{
    'click:delete': [locationId: number];
    'change:state': [locationId: number, status: LocationState];
}>();

const i18n = useI18n();
const router = useRouter();

/**
 * Get the image URL for the location.
 * @param location The location object.
 * @returns The image URL or placeholder.
 */
function getLocationImageUrl(location: Location): string {
    const [image] = location.images || [];
    if (image) return image.url;
    return getLocationPlaceholderImage(location);
}

/**
 * Handle location status change.
 * @param locationId The location ID.
 * @param status The new status.
 */
function onStatusChange(locationId: number, status: LocationState): void {
    emit('change:state', locationId, status);
}

/**
 * Handle delete action.
 * @param locationId The location ID.
 */
function onDelete(locationId: number): void {
    emit('click:delete', locationId);
}

/**
 * Navigate to location detail page.
 */
function navigateToDetail(): void {
    router.push({
        name: 'dashboard.locations.detail.info',
        params: { locationId: props.location.id },
    });
}
</script>

<template>
    <div class="location-card">
        <!-- Clickable area -->
        <div class="location-card-clickable" @click="navigateToDetail">
            <!-- Location Image -->
            <div class="location-image-container">
                <img
                    :src="getLocationImageUrl(location)"
                    :alt="location.name"
                    class="h-full w-full object-cover" />
            </div>

            <!-- Main Content -->
            <div class="min-w-0 flex-2 space-y-3">
                <!-- Header with name and address -->
                <div class="flex w-full items-center justify-between gap-3">
                    <h3 class="text-lg font-semibold text-gray-900 transition-colors md:text-xl">
                        {{ location.name }}
                    </h3>
                    <LocationStateBadge :location="location" />
                </div>

                <RouterLink
                    :to="{
                        name: 'dashboard.profiles.detail.overview',
                        params: { profileId: location.createdBy?.id },
                    }"
                    @click.stop
                    v-if="location.createdBy"
                    class="mb-4 block">
                    <Badge severity="contrast" class="inline-flex gap-2">
                        <FontAwesomeIcon :icon="faUser" />
                        <span>
                            {{ location.createdBy.firstName }}
                        </span>
                        <FontAwesomeIcon :icon="faArrowRight" />
                    </Badge>
                </RouterLink>

                <LocationLanguagesList :location="location" />

                <p class="text-sm text-gray-500">
                    {{ formatLocationAddress(location) }}
                </p>

                <!-- Description -->
                <p class="text-sm text-gray-700">
                    {{ location.excerpt?.[i18n.locale.value] }}
                </p>
            </div>
        </div>

        <!-- Action Button -->
        <div class="location-actions">
            <LocationActionsMenu
                :location="location"
                :is-pending="actionIsPending"
                :delete-is-pending="deleteIsPending"
                :show-status-change="showStatusChange"
                @change:status="onStatusChange"
                @click:delete="onDelete">
            </LocationActionsMenu>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.location-card {
    @apply flex flex-col gap-3 p-3;
    @apply rounded-lg border border-slate-200 bg-white;
    @apply md:flex-row md:gap-6 md:p-4;
}

.location-card-clickable {
    @apply flex flex-1 cursor-pointer flex-col gap-3;
    @apply md:flex-row md:items-center md:gap-6;
}

.location-image-container {
    @apply relative aspect-square w-full flex-shrink-0 overflow-hidden rounded-xl;
    @apply max-h-[200px];
    @apply md:max-h-[175px] md:w-auto;
}

.location-actions {
    @apply flex items-center justify-center self-stretch border-t border-slate-100 pt-3;
    @apply md:border-t-0 md:border-l md:ps-4 md:pt-0;
}
</style>
