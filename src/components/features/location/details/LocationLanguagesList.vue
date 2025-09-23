<template>
    <div class="flex flex-wrap gap-2">
        <template v-for="locale in availableLocales" :key="locale">
            <Badge class="bg-primary-100 text-primary-600" v-if="hasLocale(locale)">
                {{ locale.toUpperCase() }}
            </Badge>
            <Badge class="bg-gray-100 text-gray-400" v-else>
                {{ locale.toUpperCase() }}
            </Badge>
        </template>
    </div>
</template>

<script setup lang="ts">
import Badge from 'primevue/badge';
import { useI18n } from 'vue-i18n';
import type { Location } from '@/domain/location';

const props = defineProps<{
    location: Location;
}>();

const { availableLocales } = useI18n();

function hasLocale(locale: string) {
    const location = props.location;
    return location.description?.[locale] || location.excerpt?.[locale];
}
</script>
