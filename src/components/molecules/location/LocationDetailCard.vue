<script lang="ts" setup>
import Badge from 'primevue/badge';
import SlideCarousel from '@/components/molecules/image/SlideCarousel.vue';
import LocationStateBadge from '@/components/molecules/location/details/LocationStateBadge.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { type Image } from '@/domain/image';
import { formatLocationAddress, LocationState, type Location } from '@/domain/location';
import type { RouteLocationRaw } from 'vue-router';

const props = defineProps<{
    location: Location;
    showNavigationButtons?: boolean;
    to?: RouteLocationRaw;
}>();

const { locale } = useI18n();
const router = useRouter();

const images = computed<Image[]>(() => {
    return props.location.images ?? [];
});

const isApproved = computed<boolean>(() => {
    return props.location.state === LocationState.Approved;
});

const navigate = (): void => {
    if (props.to) {
        router.push(props.to);
    }
};
</script>

<template>
    <div class="location-detail" :class="{ clickable: to }">
        <div class="location-detail__image-container">
            <SlideCarousel
                class="location-detail__carousel"
                :items="images"
                :disabled="!isApproved"
                :show-navigation-buttons="showNavigationButtons"
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
                :state="location.state"
                class="location-detail__state-badge">
            </LocationStateBadge>
        </div>

        <div class="location-detail__content" @click="navigate">
            <div class="location-detail__top">
                <h3 class="location-detail__title">{{ location.name }}</h3>
                <RouterLink
                    v-if="location.authority"
                    :to="{
                        name: 'manage.authority.info',
                        params: { authorityId: location.authority.id },
                    }"
                    @click.stop>
                    <Badge size="small" severity="contrast">
                        {{ location.authority.name }}
                    </Badge>
                </RouterLink>
            </div>

            <div v-if="formatLocationAddress(location)" class="location-detail__address">
                <span>{{ formatLocationAddress(location) }}</span>
            </div>

            <p v-if="location.excerpt[locale]" class="location-detail__excerpt">
                {{ location.excerpt[locale] }}
            </p>
        </div>
    </div>
</template>

<style>
@reference '@/assets/styles/main.css';

.location-detail {
    @apply flex h-full w-full flex-col;
    @apply rounded-lg border border-slate-200 bg-white;
    @apply overflow-hidden;
    @apply transition-shadow duration-200;

    &.clickable {
        @apply cursor-pointer;

        &:hover {
            @apply shadow-md;
        }
    }

    .location-detail__image-container {
        @apply relative w-full;
    }

    .location-detail__carousel {
        .carousel__image {
            @apply aspect-12/9 w-full object-cover;
        }
    }

    .location-detail__state-badge {
        @apply absolute top-2 right-2 z-10;
    }

    .location-detail__content {
        @apply flex flex-col gap-2 p-4;
    }

    .location-detail__top {
        @apply flex items-start justify-between gap-3;
    }

    .location-detail__title {
        @apply text-lg font-semibold text-slate-900;
        @apply line-clamp-2 flex-1;
    }

    .location-detail__address {
        @apply flex items-center gap-1.5;
        @apply text-sm text-slate-500;
    }

    .location-detail__excerpt {
        @apply text-sm leading-relaxed text-slate-600;
        @apply line-clamp-2;
        @apply mt-1;
    }
}
</style>
