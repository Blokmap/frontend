<script setup lang="ts">
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardLoading from '@/layouts/dashboard/DashboardLoading.vue';
import DashboardPageHeader from '@/layouts/dashboard/DashboardPageHeader.vue';

// TODO: Add statistics loading logic
const isLoading = false;
</script>

<template>
    <DashboardContent>
        <DashboardLoading v-if="isLoading" />

        <template v-else>
            <DashboardPageHeader
                title="Statistieken"
                subtitle="Overzicht van platform statistieken en analyses." />

            <div class="rounded-lg bg-white p-4 shadow md:p-6">
                <p class="text-gray-500">
                    Deze pagina toont verschillende statistieken over het platform, zoals:
                </p>
                <ul class="mt-4 space-y-2 text-gray-600">
                    <li>• Totaal aantal gebruikers</li>
                    <li>• Aantal locaties</li>
                    <li>• Reservatiesstatistieken</li>
                    <li>• Gebruiksanalyses</li>
                </ul>
            </div>
        </template>
    </DashboardContent>
</template>
