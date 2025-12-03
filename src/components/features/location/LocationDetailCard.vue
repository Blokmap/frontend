<script lang="ts" setup>
import LocationStateBadge from '@/components/features/location/details/LocationStateBadge.vue';
import SlideCarousel from '@/components/shared/molecules/image/SlideCarousel.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { formatLocationAddress, LocationState, type Location } from '@/domain/location';
import type { RouteLocationRaw } from 'vue-router';

const props = defineProps<{
    location: Location;
    to?: RouteLocationRaw;
}>();

const { locale } = useI18n();
const router = useRouter();

const isApproved = computed<boolean>(() => {
    return props.location.state === LocationState.Approved;
});

function navigate() {
    if (props.to) {
        router.push(props.to);
    }
}
</script>

<template>
    <div class="location-detail" :class="{ clickable: to }">
        <div class="location-detail__carousel-wrapper">
            <SlideCarousel
                class="location-detail__carousel"
                :items="location.images ?? []"
                :disabled="!isApproved"
                :show-navigation-buttons="isApproved"
                :show-dots="isApproved"
                @click.stop>
                <template #default="{ item }">
                    <img
                        :src="item.url"
                        alt="Location Image"
                        class="carousel__image"
                        @click="navigate" />
                </template>
            </SlideCarousel>
            <LocationStateBadge
                v-if="location.state !== LocationState.Approved"
                :location="location"
                class="location-detail__badge">
            </LocationStateBadge>
        </div>
        <div class="location-detail__content" @click="navigate">
            <h2 class="location-detail__name">{{ location.name }}</h2>
            <p class="location-detail__address">
                {{ formatLocationAddress(location) }}
            </p>
            <p class="location-detail__excerpt">
                {{ location.excerpt[locale] }}
            </p>
        </div>
    </div>
</template>

<style>
@reference '@/assets/styles/main.css';

.location-detail {
    @apply flex h-full w-full flex-col rounded-xl shadow-md;

    &.clickable {
        @apply cursor-pointer transition-shadow hover:shadow-lg;
    }

    .location-detail__carousel-wrapper {
        @apply relative;
    }

    .location-detail__carousel {
        .carousel__image {
            @apply h-40 w-full rounded-t-xl object-cover;
        }
    }

    .location-detail__badge {
        @apply absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 shadow-lg;
    }

    .location-detail__content {
        @apply flex-1 rounded-b-xl bg-white p-4;

        .location-detail__name {
            @apply truncate text-lg font-semibold;
        }

        .location-detail__address {
            @apply text-xs text-slate-600;
        }

        .location-detail__excerpt {
            @apply mt-2 text-sm text-slate-800;
        }
    }
}
</style>
