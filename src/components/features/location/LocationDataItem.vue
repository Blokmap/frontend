<script lang="ts" setup>
import Badge from 'primevue/badge';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { formatLocationAddress, getLocationImageUrl } from '@/domain/location';
import LocationActionMenu from './LocationActionMenu.vue';
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
    'click:delete': [];
    'select:state': [status: LocationState];
}>();

const i18n = useI18n();
const router = useRouter();

/**
 * Handle location status change.
 * @param status The new status.
 */
function onStateSelect(state: LocationState): void {
    emit('select:state', state);
}

/**
 * Handle delete action.
 */
function onDelete(): void {
    emit('click:delete');
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
    <div class="location-card" @click="navigateToDetail">
        <!-- Location Image -->
        <div class="location-card__image-wrap">
            <img
                :src="getLocationImageUrl(location)"
                :alt="location.name"
                class="location-card__image" />
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
                v-if="location.createdBy"
                class="mb-4 block"
                :to="{
                    name: 'dashboard.profiles.detail.overview',
                    params: { profileId: location.createdBy.id },
                }"
                @click.stop>
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

        <!-- Action Button -->
        <div class="location-card__actions">
            <LocationActionMenu
                :location="location"
                :is-pending="actionIsPending"
                @select:state="onStateSelect"
                @click:delete="onDelete">
            </LocationActionMenu>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.location-card {
    @apply flex flex-col gap-3 p-3;
    @apply cursor-pointer rounded-lg bg-white shadow-xs;
    @apply md:flex-row md:gap-6 md:p-4;

    .location-card__image-wrap {
        @apply relative aspect-square w-full flex-shrink-0 overflow-hidden rounded-xl;
        @apply max-h-[200px];
        @apply md:max-h-[175px] md:w-auto;
    }

    .location-card__image {
        @apply h-full w-full object-cover;
    }

    .location-card__actions {
        @apply flex items-center justify-center self-stretch border-t border-slate-100 pt-3;
        @apply md:border-t-0 md:border-l md:ps-4 md:pt-0;
    }
}
</style>
