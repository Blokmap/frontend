<script setup lang="ts">
import PublicFooter from './PublicFooter.vue';
import PublicHeader from './PublicHeader.vue';
</script>

<template>
    <div class="m-3 rounded-md bg-gray-50 pb-0 md:m-6">
        <div class="px-3 py-6 md:px-6 2xl:mx-auto 2xl:w-7/8">
            <PublicHeader></PublicHeader>
        </div>

        <main class="mx-auto mb-6 flex w-full flex-col items-stretch px-3 md:px-6 2xl:w-7/8">
            <RouterView v-slot="{ Component }">
                <KeepAlive :include="['LocationsPage']">
                    <component :is="Component" />
                </KeepAlive>
            </RouterView>
        </main>

        <PublicFooter></PublicFooter>
    </div>
</template>
