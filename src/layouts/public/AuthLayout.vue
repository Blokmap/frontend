<script lang="ts" setup>
import { faSignIn, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import Tabs from 'primevue/tabs';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const items = [
    { label: 'Login', route: '/auth/login', icon: faSignIn },
    { label: 'Register', route: '/auth/register', icon: faUserPlus },
];

/**
 *  Handles the tab change event.
 *
 * @param newValue The new tab value selected by the user.
 */
function onTabChange(newValue: string | number) {
    router.push(newValue.toString());
}
</script>
<template>
    <h1 class="mb-4 text-3xl font-semibold">Account</h1>
    <Tabs :value="route.path" @update:value="onTabChange">
        <TabList>
            <Tab v-for="tab in items" :key="tab.label" :value="tab.route">
                <span class="flex items-center gap-2">
                    <FontAwesomeIcon :icon="tab.icon" /> {{ tab.label }}
                </span>
            </Tab>
        </TabList>
    </Tabs>
    <RouterView :key="route.path" />
</template>
