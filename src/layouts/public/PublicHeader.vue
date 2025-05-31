<script setup lang="ts">
import { Button, InputText } from 'primevue';
import { RouterLink } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import LocationSearch from '@/components/features/location/LocationSearch.vue';

const navigation = [
    {
        name: 'Home',
        link: { name: 'home' },
    },
    {
        name: 'Test',
        link: { name: 'test' },
    },
];
</script>

<template>
    <!-- Public Header -->
    <header class="flex p-4 border-b-2 border-slate-100">
        <!-- Container -->
        <div class="flex items-center justify-between w-full md:w-10/12 mx-auto">
            <!-- Logo and nav -->
            <div class="flex items-center gap-9">
                <h2 class="text-xl font-bold leading-tight">
                    <FontAwesomeIcon :icon="faGraduationCap" class="text-primary" />
                    Blokmap
                </h2>
                <div class="flex items-center gap-6">
                    <template v-for="item in navigation" :key="item.name">
                        <RouterLink
                            :to="item.link"
                            class="text-sm font-medium"
                            v-slot="{ isExactActive }">
                            <span
                                :class="{
                                    ['px-3 py-2 rounded-lg']: true,
                                    ['bg-timber-green-600 text-white']: isExactActive,
                                }"
                                >{{ item.name }}</span
                            >
                        </RouterLink>
                    </template>
                </div>
            </div>
            <!-- Search and auth -->
            <div class="flex gap-3">
                <LocationSearch />
                <Button v-tooltip="'hellaur'">Sign Up</Button>
                <Button severity="contrast">Log In</Button>
            </div>
        </div>
    </header>
</template>
