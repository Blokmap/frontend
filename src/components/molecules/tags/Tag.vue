<script lang="ts" setup>
import Badge from 'primevue/badge';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useI18n } from 'vue-i18n';
import type { Tag } from '@/domain/tag';

defineProps<{
    tag: Tag;
}>();

const { locale } = useI18n();
</script>

<template>
    <Badge severity="contrast">
        <FontAwesomeIcon :icon="tag.icon?.split(' ') ?? faTag" />
        <span>{{ tag.name[locale] }}</span>
    </Badge>
</template>
