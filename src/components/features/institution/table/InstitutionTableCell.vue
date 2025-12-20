<script lang="ts" setup>
import EntityAvatar from '@/components/shared/molecules/avatar/EntityAvatar.vue';
import { faCity } from '@fortawesome/free-solid-svg-icons';
import { useI18n } from 'vue-i18n';
import type { Institution } from '@/domain/institution';

defineProps<{
    institution: Institution;
}>();

const { locale } = useI18n();
</script>

<template>
    <div class="flex items-center space-x-3">
        <EntityAvatar
            class="h-12 w-12 flex-shrink-0"
            :image="institution.logo?.url"
            :icon="faCity"
            :circle="false">
        </EntityAvatar>
        <div class="min-w-0 flex-1">
            <div class="truncate text-sm font-medium text-slate-900">
                {{ institution.name[locale] }}
            </div>
            <div class="truncate text-xs text-slate-500">
                {{ institution.slug }}
            </div>
        </div>
    </div>
</template>
