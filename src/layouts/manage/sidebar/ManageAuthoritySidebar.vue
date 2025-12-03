<script lang="ts" setup>
import EntityAvatar from '@/components/shared/molecules/avatar/EntityAvatar.vue';
import LayoutSidebar from '@/layouts/LayoutSidebar.vue';
import LayoutSidebarItem from '@/layouts/LayoutSidebarItem.vue';
import { faInfoCircle, faMapLocationDot, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useReadAuthority } from '@/composables/data/useAuthorities';

const props = defineProps<{
    authorityId: string;
}>();

const route = useRoute();
const router = useRouter();

const authorityIdNum = computed(() => +props.authorityId);
const enabled = computed(() => !Number.isNaN(authorityIdNum.value) && authorityIdNum.value > 0);

const { data: authority, isLoading } = useReadAuthority(authorityIdNum, { enabled });

function goBack() {
    router.push({ name: 'manage' });
}
</script>

<template>
    <LayoutSidebar
        :title="authority?.name ?? 'Groep'"
        :loading="isLoading"
        show-back-button
        @click:back="goBack">
        <div class="sidebar-nav-group">
            <LayoutSidebarItem
                :loading="isLoading"
                :to="{ name: 'manage.authority.overview', params: { authorityId } }"
                :active="route.name === 'manage.authority.overview'">
                <template #img>
                    <EntityAvatar
                        :image="authority?.logo?.url"
                        :icon="faInfoCircle"
                        class="sidebar__avatar">
                    </EntityAvatar>
                </template>
                <template #text>Overzicht</template>
            </LayoutSidebarItem>

            <LayoutSidebarItem
                :loading="isLoading"
                :to="{ name: 'manage.authority.locations', params: { authorityId } }"
                :active="route.name === 'manage.authority.locations'">
                <template #img>
                    <FontAwesomeIcon :icon="faMapLocationDot" />
                </template>
                <template #text>Locaties</template>
            </LayoutSidebarItem>

            <LayoutSidebarItem
                :loading="isLoading"
                :to="{ name: 'manage.authority.members', params: { authorityId } }"
                :active="route.name === 'manage.authority.members'">
                <template #img>
                    <FontAwesomeIcon :icon="faUsers" />
                </template>
                <template #text>Leden</template>
            </LayoutSidebarItem>
        </div>
    </LayoutSidebar>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.sidebar__avatar {
    @apply h-8 w-8 shrink-0 lg:h-10 lg:w-10;
}
</style>
