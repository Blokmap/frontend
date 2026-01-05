<script lang="ts" setup>
import Badge from 'primevue/badge';
import LayoutContainer from '@/components/organisms/layouts/LayoutContainer.vue';
import Loader from '@/components/organisms/layouts/Loader.vue';
import LoaderError from '@/components/organisms/layouts/LoaderError.vue';
import LayoutSidebar from '@/components/organisms/layouts/sidebar/LayoutSidebar.vue';
import {
    faBuilding,
    faCity,
    faMapLocationDot,
    faStarHalfStroke,
    faTags,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useAdminCounts } from '@/composables/data/useAdmin';
import LayoutSidebarItem from '../sidebar/LayoutSidebarItem.vue';
import LayoutSidebarSection from '../sidebar/LayoutSidebarSection.vue';
import type { Profile } from '@/domain/profile';

defineProps<{
    authProfile: Profile;
}>();

// const {
//     data: stats,
//     isPending: isStatsPending,
//     isError: isStatsError,
//     error: statsError,
// } = useAdminStats();

const {
    data: counts,
    isPending: isCountsPending,
    isError: isCountsError,
    error: countsError,
} = useAdminCounts();

const isError = computed<boolean>(() => {
    return isCountsError.value;
});

const isPending = computed<boolean>(() => {
    return isCountsPending.value;
});
</script>

<template>
    <LayoutContainer>
        <template #sidebar>
            <LayoutSidebar title="Admin">
                <LayoutSidebarSection title="Locaties">
                    <LayoutSidebarItem :to="{ name: 'admin.locations' }" :loading="!counts">
                        <template #img>
                            <FontAwesomeIcon :icon="faMapLocationDot" />
                        </template>
                        <template #text>
                            <div class="sidebar-item__badged">
                                <span>Locaties</span>
                                <div class="space-x-2" v-if="counts">
                                    <Badge severity="contrast" size="small">
                                        {{ counts.locationCount - counts.pendingLocationCount }}
                                    </Badge>
                                    <Badge severity="secondary" size="small">
                                        +{{ counts.pendingLocationCount }}
                                    </Badge>
                                </div>
                            </div>
                        </template>
                    </LayoutSidebarItem>
                    <LayoutSidebarItem :to="{ name: 'admin.tags' }">
                        <template #img>
                            <FontAwesomeIcon :icon="faTags" />
                        </template>
                        <template #text>
                            <span>Tags</span>
                        </template>
                    </LayoutSidebarItem>
                    <LayoutSidebarItem
                        :to="{ name: 'admin.locations' }"
                        :loading="!counts"
                        disabled>
                        <template #img>
                            <FontAwesomeIcon :icon="faStarHalfStroke" />
                        </template>
                        <template #text>
                            <span>Reviews</span>
                        </template>
                    </LayoutSidebarItem>
                </LayoutSidebarSection>
                <LayoutSidebarSection title="Entiteiten">
                    <LayoutSidebarItem :to="{ name: 'admin.profiles' }" :loading="!counts">
                        <template #img>
                            <FontAwesomeIcon :icon="faUsers" />
                        </template>
                        <template #text>
                            <div class="sidebar-item__badged">
                                <span>Gebruikers</span>
                                <Badge severity="contrast" size="small">
                                    {{ counts?.profileCount }}
                                </Badge>
                            </div>
                        </template>
                    </LayoutSidebarItem>
                    <LayoutSidebarItem :to="{ name: 'admin.institutions' }" :loading="!counts">
                        <template #img>
                            <FontAwesomeIcon :icon="faCity" />
                        </template>
                        <template #text>
                            <div class="sidebar-item__badged">
                                <span>Organisaties</span>
                                <Badge severity="contrast" size="small">
                                    {{ counts?.institutionCount }}
                                </Badge>
                            </div>
                        </template>
                    </LayoutSidebarItem>
                    <LayoutSidebarItem :to="{ name: 'admin.authorities' }" :loading="!counts">
                        <template #img>
                            <FontAwesomeIcon :icon="faBuilding" />
                        </template>
                        <template #text>
                            <div class="sidebar-item__badged">
                                <span>Groepen</span>
                                <Badge severity="contrast" size="small">
                                    {{ counts?.authorityCount }}
                                </Badge>
                            </div>
                        </template>
                    </LayoutSidebarItem>
                </LayoutSidebarSection>
            </LayoutSidebar>
        </template>

        <template #main>
            <Loader v-if="isPending" />
            <RouterView
                v-else-if="!isError && counts"
                v-slot="{ Component, route }"
                :auth-profile="authProfile">
                <Transition name="fade-slide-up" mode="out-in">
                    <component :is="Component" :key="route.name" />
                </Transition>
            </RouterView>
            <LoaderError v-else :errors="[countsError]" />
        </template>
    </LayoutContainer>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.sidebar-item__badged {
    @apply flex items-center justify-between gap-2;
}
</style>
