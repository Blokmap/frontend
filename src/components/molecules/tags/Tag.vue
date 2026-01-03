<script lang="ts" setup>
import Badge from 'primevue/badge';
import {
    findIconDefinition,
    type IconDefinition,
    type IconName,
    type IconPrefix,
} from '@fortawesome/fontawesome-svg-core';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Tag } from '@/domain/tag';

const props = defineProps<{
    tag: Tag;
}>();

const { locale } = useI18n();

const icon = computed<IconDefinition>(() => {
    if (!props.tag.icon) {
        return faTag;
    }

    const parts = props.tag.icon.split(' ');

    if (parts.length !== 2) {
        return faTag;
    }

    const [prefix, iconName] = parts as [IconPrefix, IconName];

    const iconDefinition = findIconDefinition({ prefix, iconName });

    return iconDefinition ?? faTag;
});
</script>

<template>
    <Badge severity="contrast">
        <FontAwesomeIcon :icon="icon" class="mr-2" />
        <span>{{ tag.name[locale] }}</span>
    </Badge>
</template>
