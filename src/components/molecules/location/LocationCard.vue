<script lang="ts" setup>
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { getLocationImageUrl, getLocationPlaceholderImage } from '@/domain/location';
import type { Location } from '@/domain/location';

const { locale } = useI18n();

const props = withDefaults(
    defineProps<{
        active?: boolean;
        location: Location;
    }>(),
    {
        active: false,
    },
);

const imageUrl = computed(() => {
    if (props.location.images?.length) {
        return getLocationImageUrl(props.location);
    }

    return getLocationPlaceholderImage(props.location);
});
</script>

<template>
    <div class="location">
        <div class="location__image" :class="{ active }">
            <img :src="imageUrl" />
        </div>
        <div class="bg-white p-3 shadow-md">
            <h2 class="mt-1 truncate font-semibold">
                {{ location.name }}
            </h2>
            <p class="line-clamp-2 text-xs text-gray-600">
                <FontAwesomeIcon :icon="faLocationDot" /> {{ location.city }}, {{ location.street }}
            </p>
            <p class="line-clamp-2 text-xs text-gray-600">
                {{ location.excerpt?.[locale] }}
            </p>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.location {
    @apply flex aspect-square flex-col gap-2 transition-all duration-300 hover:scale-102;

    &.active {
        @apply hidden;
    }

    .location__image {
        @apply relative h-full w-full overflow-hidden;
        @apply rounded-2xl shadow-md;

        img {
            @apply aspect-square h-full w-full rounded-xl object-cover;
        }
    }
}
</style>
