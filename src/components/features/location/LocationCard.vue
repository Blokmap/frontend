<script lang="ts" setup>
import type { Location } from '@/types/schema/Location';
import { getLocationPlaceholderImage } from '@/utils/location';
import { faHeart, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

withDefaults(
    defineProps<{
        active?: boolean;
        location: Location;
    }>(),
    {
        active: false,
    },
);
</script>

<template>
    <div class="location">
        <div class="location--image" :class="{ active }">
            <img :src="getLocationPlaceholderImage(location)" />
            <div class="address">
                <FontAwesomeIcon :icon="faLocationDot" class="text-secondary" />
                {{ location.city }}, {{ location.province }}
            </div>
            <div class="heart">
                <FontAwesomeIcon :icon="faHeart" />
            </div>
        </div>
        <h2 class="text-md my-1 truncate font-semibold">{{ location.name }}</h2>
        <p class="line-clamp-2 text-xs text-gray-600">
            {{ location.excerpt?.[locale] }}
        </p>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.location {
    @apply flex aspect-square flex-col gap-2 transition-all duration-300 hover:scale-102;

    &.active {
        @apply hidden;
    }

    .location--image {
        @apply relative h-full w-full overflow-hidden rounded-xl;

        .heart {
            @apply absolute top-1 right-2 text-2xl text-white transition-colors duration-200 hover:text-red-500;
        }

        .address {
            @apply absolute top-2 left-2 flex max-w-40 items-center gap-2 truncate rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium shadow;
        }

        img {
            @apply aspect-square h-full w-full rounded-xl object-cover;
        }
    }
}
</style>
