<script setup lang="ts">
import EntityAvatar from '@/components/molecules/avatar/EntityAvatar.vue';
import { useI18n } from 'vue-i18n';
import type { ProfileReport } from '@/domain/report';

defineProps<{
    report: ProfileReport;
    pending?: boolean;
}>();

defineEmits<{
    'click:delete': [profileId: number, reportId: number];
}>();

const { locale } = useI18n();
</script>

<template>
    <div class="flex items-center gap-3 rounded-md border border-slate-200 bg-white p-3">
        <RouterLink
            :to="{
                name: 'dashboard.profiles.detail.overview',
                params: { profileId: report.profile.id },
            }">
            <EntityAvatar :profile="report.profile" class="h-18 w-18" />
        </RouterLink>

        <div class="flex-1 space-y-1">
            <RouterLink
                :to="{
                    name: 'dashboard.profiles.detail.overview',
                    params: { profileId: report.profile.id },
                }"
                class="block font-medium hover:underline">
                {{ report.profile.firstName }} {{ report.profile.lastName }}
            </RouterLink>
            <p class="text-sm text-gray-600"><b>Reden:</b> {{ report.reason }}</p>
            <div class="flex gap-3 text-xs text-slate-500">
                <RouterLink
                    v-if="report.createdBy"
                    :to="{
                        name: 'dashboard.profiles.detail.overview',
                        params: { profileId: report.createdBy.id },
                    }"
                    class="hover:text-gray-600">
                    {{ report.createdBy.firstName }} {{ report.createdBy.lastName }}
                </RouterLink>
                <span>{{ report.createdAt.toLocaleDateString(locale) }}</span>
            </div>
        </div>

        <div class="flex items-center">
            <slot name="actions"></slot>
        </div>
    </div>
</template>
