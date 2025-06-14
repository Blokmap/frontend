<script lang="ts" setup>
import type { Location } from '@/types/schema/Location';
import { getLocationPlaceholderImage } from '@/utils/location';
import { faHeart, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

defineProps<{
    location: Location;
}>();
</script>

<template>
    <div class="flex aspect-square flex-col gap-2 transition-all duration-300 hover:scale-102">
        <div class="relative h-full w-full overflow-hidden rounded-xl">
            <img
                :src="getLocationPlaceholderImage(location)"
                class="aspect-square h-full w-full rounded-xl object-cover" />
            <div
                class="absolute top-2 left-2 flex items-center gap-2 rounded-full bg-white/90 px-2 py-0.5 text-sm font-medium shadow">
                <FontAwesomeIcon :icon="faLocationDot" class="text-secondary" />
                {{ location.city ?? 'Ghent, Belgium' }}
            </div>
            <div
                class="absolute top-1 right-2 text-2xl text-white transition-colors duration-200 hover:text-red-500">
                <FontAwesomeIcon :icon="faHeart" />
            </div>
        </div>
        <h2 class="my-1 truncate text-sm font-semibold">{{ location.name }}</h2>
        <p class="line-clamp-2 text-xs text-gray-600">
            {{
                location.excerpt?.[locale] ??
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
            }}
        </p>
    </div>
</template>
