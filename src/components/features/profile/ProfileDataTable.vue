<script lang="ts" setup>
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import type { Profile } from '@/domain/profile';

const props = withDefaults(
    defineProps<{
        profiles?: Profile[];
        loading?: boolean;
        emptyMessage?: string;
    }>(),
    {
        loading: false,
        emptyMessage: 'Geen profielen gevonden',
    },
);

const emit = defineEmits<{
    'click:profile': [profile: Profile];
}>();

const onProfileClick = (profile: Profile) => {
    emit('click:profile', profile);
};
</script>

<template>
    <DataTable
        dataKey="id"
        :value="props.profiles"
        :loading="props.loading"
        :emptyMessage="props.emptyMessage">
        <Column header="Profiel">
            <template #body="{ data: profile }">
                <div
                    class="flex cursor-pointer items-center gap-3 py-2"
                    @click="onProfileClick(profile)">
                    <!-- Simple avatar fallback instead of ProfileAvatar component -->
                    <div
                        class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-medium">
                        {{ profile.firstName?.[0] }}{{ profile.lastName?.[0] }}
                    </div>
                    <div>
                        <div class="text-sm font-medium">
                            {{ profile.firstName }} {{ profile.lastName }}
                        </div>
                        <div class="text-xs text-slate-500">@{{ profile.username }}</div>
                    </div>
                </div>
            </template>
        </Column>

        <Column header="E-mailadres">
            <template #body="{ data: profile }">
                {{ profile.email }}
            </template>
        </Column>

        <Column header="Institutie">
            <template #body="{ data: profile }">
                {{ profile.institution?.name || '-' }}
            </template>
        </Column>

        <Column header="Status">
            <template #body="{ data: profile }">
                <span
                    :class="profile.isAdmin ? 'text-red-600' : 'text-green-600'"
                    class="text-sm font-medium">
                    {{ profile.isAdmin ? 'Admin' : 'Gebruiker' }}
                </span>
            </template>
        </Column>

        <Column header="Acties">
            <template #body="{ data: profile }">
                <Button icon="pi pi-eye" size="small" text @click="onProfileClick(profile)" />
            </template>
        </Column>
    </DataTable>
</template>
