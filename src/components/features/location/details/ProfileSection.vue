<script lang="ts" setup>
import ProfileAvatar from '@/components/features/profile/avatar/ProfileAvatar.vue';
import type { Profile } from '@/domain/profile';
import { useI18n } from 'vue-i18n';

defineProps<{
    profile: Profile;
}>();

const { locale } = useI18n();
</script>

<template>
    <div class="flex gap-6 border-y-2 border-slate-200 py-3">
        <ProfileAvatar class="w-14" :profile="profile" />
        <div class="space-y-1">
            <h3 class="text-lg font-medium">Geregistreerd door {{ profile.firstName }}</h3>
            <p class="text-sm text-slate-500">
                Lid sinds
                {{
                    profile.createdAt.toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })
                }}
            </p>
        </div>
    </div>
</template>
