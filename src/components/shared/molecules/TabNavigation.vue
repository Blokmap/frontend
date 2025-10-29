<script lang="ts" setup>
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import Tabs from 'primevue/tabs';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type TabItem = {
    value: string;
    label: string;
    icon?: IconDefinition;
    class?: string | string[];
    align?: 'left' | 'right';
    route: {
        name: string;
        params?: Record<string, any>;
        query?: Record<string, any>;
    };
};

const { tabs } = defineProps<{
    tabs: TabItem[];
}>();

const route = useRoute();
const router = useRouter();

const leftTabs = computed(() => tabs.filter((tab) => tab.align !== 'right'));
const rightTabs = computed(() => tabs.filter((tab) => tab.align === 'right'));

const activeTab = computed({
    get: () => {
        const currentTab = tabs.find((tab) => tab.route.name === route.name);
        return currentTab ? currentTab.value : tabs[0]?.value;
    },
    set: (value: string) => {
        const selectedTab = tabs.find((tab) => tab.value === value);

        if (selectedTab) {
            router.push(selectedTab.route);
        }
    },
});
</script>

<template>
    <div class="tabs-wrapper">
        <Tabs :value="activeTab" @update:value="activeTab = $event.toString()" class="text-sm">
            <TabList>
                <div class="mr-auto">
                    <slot name="tab" v-for="tab in leftTabs" :key="tab.value" :tab="tab">
                        <Tab :value="tab.value" :class="tab.class">
                            <FontAwesomeIcon v-if="tab.icon" :icon="tab.icon" class="tab-icon" />
                            <span class="tab-label">{{ tab.label }}</span>
                        </Tab>
                    </slot>
                </div>
                <div class="ml-auto">
                    <slot name="tab" v-for="tab in rightTabs" :key="tab.value" :tab="tab">
                        <Tab :value="tab.value" :class="tab.class">
                            <FontAwesomeIcon v-if="tab.icon" :icon="tab.icon" class="tab-icon" />
                            <span class="tab-label">{{ tab.label }}</span>
                        </Tab>
                    </slot>
                </div>
            </TabList>
        </Tabs>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.tabs-wrapper {
    @apply -mx-3 overflow-x-auto px-3;
    @apply md:mx-0 md:overflow-visible md:px-0;
}

.tab-icon {
    @apply mr-0 md:mr-2;
}

.tab-label {
    @apply hidden md:inline;
}
</style>
