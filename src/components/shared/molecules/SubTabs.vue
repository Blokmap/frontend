<script lang="ts" setup>
import TabList from 'primevue/tablist';
import Tabs from 'primevue/tabs';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps<{
    defaultTab?: string;
}>();

const model = defineModel<string>();

const route = useRoute();
const router = useRouter();

const activeTab = computed({
    get: () => (model.value ?? route.hash.slice(1)) || props.defaultTab || '',
    set: (value: string) => {
        model.value = value;
        router.replace({ ...route, hash: `#${value}` });
    },
});
</script>

<template>
    <Tabs :value="activeTab" @update:value="activeTab = $event.toString()" class="sub-tabs">
        <TabList>
            <slot></slot>
        </TabList>
    </Tabs>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.sub-tabs {
    @apply text-sm;
}
</style>
