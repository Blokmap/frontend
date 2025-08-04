<script setup lang="ts">
import PublicFooter from './PublicFooter.vue';
import PublicHeader from './PublicHeader.vue';
</script>

<template>
    <div class="m-3 rounded-lg bg-white md:m-6">
        <div class="p-6 2xl:mx-auto 2xl:w-7/8">
            <PublicHeader></PublicHeader>
        </div>
        <main class="mx-auto flex w-full flex-grow flex-col items-stretch px-6 2xl:w-7/8">
            <RouterView v-slot="{ Component }">
                <KeepAlive :include="['LocationsPage']">
                    <component :is="Component" />
                </KeepAlive>
            </RouterView>
        </main>
        <div class="p-6 2xl:mx-auto 2xl:w-7/8">
            <PublicFooter />
        </div>
    </div>
</template>
