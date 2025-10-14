<script lang="ts" setup>
import Button from 'primevue/button';
import ProfileAvatar from '@/components/features/profile/avatar/ProfileAvatar.vue';
import { faArrowRight, faEnvelope, faStar, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useI18n } from 'vue-i18n';
import type { Profile } from '@/domain/profile';

defineProps<{
    profile: Profile;
}>();

const { locale } = useI18n();
</script>

<template>
    <div class="rounded-2xl border border-slate-200 bg-white p-6">
        <div class="flex items-start gap-4">
            <ProfileAvatar class="h-16 w-16" :profile="profile" />
            <div class="flex-1 space-y-3">
                <h3 class="text-xl font-semibold text-gray-900">
                    Ingediend door {{ profile.firstName }}
                </h3>
                <p class="text-gray-600">
                    Lid sinds
                    {{
                        profile.createdAt.toLocaleDateString(locale, {
                            year: 'numeric',
                            month: 'long',
                        })
                    }}
                </p>

                <div class="flex items-center gap-4 text-sm">
                    <div class="flex items-center gap-1">
                        <FontAwesomeIcon :icon="faStar" class="h-4 w-4 text-amber-400" />
                        <span class="font-medium">4.95</span>
                        <span class="text-gray-500">· 127 beoordelingen</span>
                    </div>

                    <div v-if="profile.isAdmin" class="flex items-center gap-1">
                        <FontAwesomeIcon :icon="faUserCheck" class="text-primary h-4 w-4" />
                        <span class="text-gray-600">Geverifieerd lid</span>
                    </div>
                </div>
                <div class="flex gap-3">
                    <Button severity="contrast">
                        <FontAwesomeIcon :icon="faEnvelope" />
                        <span>Contact Opnemen</span>
                    </Button>
                    <Button>
                        <span>Toon profiel</span>
                        <FontAwesomeIcon :icon="faArrowRight" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>
