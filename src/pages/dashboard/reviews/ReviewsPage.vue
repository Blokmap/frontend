<script setup lang="ts">
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardLoading from '@/layouts/dashboard/DashboardLoading.vue';
import DashboardPageHeader from '@/layouts/dashboard/DashboardPageHeader.vue';

// TODO: Add reviews loading logic
const isLoading = false;
</script>

<template>
    <DashboardContent>
        <DashboardLoading v-if="isLoading" />

        <template v-else>
            <DashboardPageHeader
                title="Reviews"
                subtitle="Beheer en moderatie van gebruikersbeoordelingen." />

            <div class="rounded-lg bg-white p-4 shadow md:p-6">
                <p class="text-gray-500">
                    Deze pagina toont het reviewbeheer, met functionaliteit voor:
                </p>
                <ul class="mt-4 space-y-2 text-gray-600">
                    <li>• Overzicht van alle reviews</li>
                    <li>• Reviews modereren en goedkeuren</li>
                    <li>• Rapporteerde reviews behandelen</li>
                    <li>• Reviewstatistieken bekijken</li>
                </ul>
            </div>
        </template>
    </DashboardContent>
</template>
