<script lang="ts" setup>
import { computed } from 'vue';
import { useReadAuthority } from '@/composables/data/useAuthorities';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    authorityId: string;
}>();

const authorityIdNum = computed(() => +props.authorityId);
const enabled = computed(() => !Number.isNaN(authorityIdNum.value) && authorityIdNum.value > 0);

const {
    data: authority,
    isLoading,
    error,
} = useReadAuthority(authorityIdNum, {
    enabled,
    includes: ['institution'],
});
</script>

<template>
    <RouterView
        :authority="authority"
        :auth-profile="authProfile"
        :is-loading="isLoading"
        :error="error" />
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
