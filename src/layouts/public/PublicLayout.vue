<script setup lang="ts">
import PublicFooter from './PublicFooter.vue';
import PublicHeader from './PublicHeader.vue';
</script>

<template>
    <div class="m-3 space-y-6 rounded-md bg-gray-50 pt-6 md:m-6">
        <div class="mx-auto max-w-[90vw] px-3 md:px-6 2xl:w-7/8">
            <PublicHeader></PublicHeader>
        </div>

        <hr class="border-t-2 border-slate-200" />

        <main
            class="mx-auto flex max-w-[90vw] flex-col items-stretch px-3 md:px-6 md:py-6 2xl:w-7/8">
            <RouterView v-slot="{ Component }">
                <KeepAlive :include="['LocationsPage']">
                    <component :is="Component" />
                </KeepAlive>
            </RouterView>
        </main>

        <footer class="rounded-b-md border-t-2 border-slate-200 bg-white">
            <div class="mx-auto max-w-[90vw] px-3 md:px-6 2xl:w-7/8">
                <PublicFooter></PublicFooter>
            </div>
        </footer>
    </div>
</template>
