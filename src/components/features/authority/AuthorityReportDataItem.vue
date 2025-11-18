<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { AuthorityReport } from '@/domain/report';

defineProps<{
    report: AuthorityReport;
    isPending?: boolean;
}>();

defineEmits<{
    'click:delete': [authorityId: number, reportId: number];
}>();

const { locale } = useI18n();
</script>

<template>
    <div class="flex items-center gap-3 rounded-md border border-slate-200 bg-white p-3">
        <div class="flex-1 space-y-1">
            <RouterLink
                :to="{
                    name: 'dashboard.authorities.detail.overview',
                    params: { authorityId: report.authority.id },
                }"
                class="block font-medium hover:underline">
                {{ report.authority.name }}
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
