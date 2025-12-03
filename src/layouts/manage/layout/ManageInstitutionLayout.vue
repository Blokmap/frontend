<script lang="ts" setup>
import { computed } from 'vue';
import { useReadInstitution } from '@/composables/data/useInstitutions';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    institutionId: string;
}>();

const institutionIdNum = computed(() => +props.institutionId);
const enabled = computed(() => !Number.isNaN(institutionIdNum.value) && institutionIdNum.value > 0);

const { data: institution, isLoading, error } = useReadInstitution(institutionIdNum, { enabled });
</script>

<template>
    <RouterView
        :institution="institution"
        :auth-profile="authProfile"
        :is-loading="isLoading"
        :error="error" />
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
