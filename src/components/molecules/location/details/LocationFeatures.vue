<script lang="ts" setup>
import Skeleton from 'primevue/skeleton';
import {
    findIconDefinition,
    type IconDefinition,
    type IconName,
    type IconPrefix,
} from '@fortawesome/fontawesome-svg-core';
import {
    faCalendarWeek,
    faChair,
    faClock,
    faMoon,
    faSun,
    faTag,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { type Location, getLocationFeatures } from '@/domain/location';

const props = defineProps<{
    location?: Location;
    loading?: boolean;
}>();

const { locale } = useI18n();

const features = computed(() => {
    return props.location ? getLocationFeatures(props.location) : null;
});

const featuresList = computed(() => {
    if (!props.location || !features.value) {
        return [];
    }

    const list = [];

    if (features.value.openInMorning) {
        list.push({
            icon: faSun,
            title: 'Open in de ochtend',
            description: 'Ideaal voor vroege vogels',
            iconColor: 'text-amber-500',
        });
    }

    if (features.value.openInEvening) {
        list.push({
            icon: faMoon,
            title: 'Open in de avond',
            description: 'Perfect voor nachtbrakers',
            iconColor: 'text-slate-600',
        });
    }

    if (features.value.openInWeekend) {
        list.push({
            icon: faCalendarWeek,
            title: 'Weekend uren',
            description: 'Beschikbaar in het weekend',
            iconColor: 'text-emerald-500',
        });
    }

    if (features.value.openAtNight) {
        list.push({
            icon: faClock,
            title: 'Verlengde uren',
            description: 'Open tot laat in de avond',
            iconColor: 'text-primary-600',
        });
    }

    if (props.location.isReservable) {
        list.push({
            icon: faCalendarWeek,
            title: 'Reservaties mogelijk',
            description: 'Reserveer je plek van tevoren',
            iconColor: 'text-primary-500',
        });
    }

    if (props.location.seatCount && props.location.seatCount > 0) {
        list.push({
            icon: faChair,
            title: `${props.location.seatCount} zitplaatsen`,
            description: 'Beschikbare zitcapaciteit',
            iconColor: 'text-primary-600',
        });
    }

    return list;
});

const allTags = computed(() => {
    if (!props.location?.tags) {
        return [];
    }

    return props.location.tags;
});

const getTagIcon = (iconString: string | null): IconDefinition => {
    if (!iconString) {
        return faTag;
    }

    const parts = iconString.split(' ');

    if (parts.length !== 2) {
        return faTag;
    }

    const [prefix, iconName] = parts as [IconPrefix, IconName];

    const iconDefinition = findIconDefinition({ prefix, iconName });

    return iconDefinition ?? faTag;
};

const allItems = computed(() => {
    const items = [
        ...featuresList.value.map((feature) => ({
            type: 'feature' as const,
            icon: feature.icon,
            text: feature.title,
        })),
        ...allTags.value.map((tag) => ({
            type: 'tag' as const,
            icon: getTagIcon(tag.icon),
            text: tag.name[locale.value] || tag.name.en || tag.name.nl || tag.name.id || '',
        })),
    ];

    return items;
});

const visibleItems = computed(() => allItems.value.slice(0, 8));
const hiddenItems = computed(() => allItems.value.slice(8));
const hasMoreItems = computed(() => allItems.value.length > 8);
</script>

<template>
    <div v-if="loading" class="items-grid">
        <div v-for="n in 4" :key="n" class="flex items-center gap-3">
            <Skeleton width="2rem" height="2rem" />
            <Skeleton width="8rem" height="1rem" />
        </div>
    </div>

    <div v-else class="space-y-6">
        <div class="items-grid">
            <div v-for="(item, idx) in visibleItems" :key="idx" class="item">
                <div class="item__icon">
                    <FontAwesomeIcon :icon="item.icon" />
                </div>
                <span class="item__text">{{ item.text }}</span>
            </div>
        </div>

        <details v-if="hasMoreItems" class="mt-4">
            <summary class="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                Toon {{ hiddenItems.length }} meer
            </summary>
            <div class="items-grid mt-4">
                <div v-for="(item, idx) in hiddenItems" :key="idx" class="item">
                    <div class="item__icon">
                        <FontAwesomeIcon :icon="item.icon" />
                    </div>
                    <span class="item__text">{{ item.text }}</span>
                </div>
            </div>
        </details>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.items-grid {
    @apply grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4;

    .item {
        @apply flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3;

        .item__icon {
            @apply text-primary flex h-8 w-8 items-center justify-center text-lg;
        }

        .item__text {
            @apply text-sm font-medium text-gray-700;
        }
    }
}
</style>
