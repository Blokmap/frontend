<script lang="ts" setup>
import LayoutSidebar from '@/layouts/LayoutSidebar.vue';
import LayoutSidebarItem from '@/layouts/LayoutSidebarItem.vue';
import { faBuilding, faInfoCircle, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useReadInstitution } from '@/composables/data/useInstitutions';

const props = defineProps<{
    institutionId: string;
}>();

const { locale } = useI18n();

const route = useRoute();
const router = useRouter();

const institutionIdNum = computed(() => +props.institutionId);
const enabled = computed(() => !Number.isNaN(institutionIdNum.value) && institutionIdNum.value > 0);

const { data: institution, isLoading } = useReadInstitution(institutionIdNum, { enabled });

function goBack() {
    router.push({ name: 'manage' });
}
</script>

<template>
    <LayoutSidebar
        :title="institution?.name[locale]"
        :loading="isLoading"
        show-back-button
        @click:back="goBack">
        <div class="sidebar-nav-group">
            <LayoutSidebarItem
                :loading="isLoading"
                :to="{ name: 'manage.institution.overview', params: { institutionId } }"
                :active="route.name === 'manage.institution.overview'">
                <template #img>
                    <FontAwesomeIcon :icon="faInfoCircle" />
                </template>
                <template #text>Overzicht</template>
            </LayoutSidebarItem>

            <LayoutSidebarItem
                :loading="isLoading"
                :to="{ name: 'manage.institution.authorities', params: { institutionId } }"
                :active="route.name === 'manage.institution.authorities'">
                <template #img>
                    <FontAwesomeIcon :icon="faBuilding" />
                </template>
                <template #text>Groepen</template>
            </LayoutSidebarItem>

            <LayoutSidebarItem
                :loading="isLoading"
                :to="{ name: 'manage.institution.members', params: { institutionId } }"
                :active="route.name === 'manage.institution.members'">
                <template #img>
                    <FontAwesomeIcon :icon="faUsers" />
                </template>
                <template #text>Leden</template>
            </LayoutSidebarItem>
        </div>
    </LayoutSidebar>
</template>
