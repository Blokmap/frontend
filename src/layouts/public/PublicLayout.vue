<script setup lang="ts">
import PublicHeader from './PublicHeader.vue';
</script>

<template>
    <div class="rounded-0 m-3 bg-white pb-6 md:m-6">
        <div class="px-3 py-6 md:px-6 2xl:mx-auto 2xl:w-7/8">
            <PublicHeader></PublicHeader>
        </div>

        <main class="mx-auto flex w-full flex-grow flex-col items-stretch px-3 md:px-6 2xl:w-7/8">
            <RouterView v-slot="{ Component }">
                <KeepAlive :include="['LocationsPage']">
                    <component :is="Component" />
                </KeepAlive>
            </RouterView>
        </main>
    </div>
</template>
