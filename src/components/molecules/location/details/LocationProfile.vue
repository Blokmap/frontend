<script lang="ts" setup>
import Button from 'primevue/button';
import EntityAvatar from '@/components/molecules/avatar/EntityAvatar.vue';
import { faArrowRight, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useI18n } from 'vue-i18n';
import type { Profile } from '@/domain/profile';

defineProps<{
    profile: Profile;
}>();

const { locale } = useI18n();
</script>

<template>
    <div class="rounded-2xl bg-white p-6 shadow-sm">
        <div class="flex items-start gap-4">
            <EntityAvatar class="h-16 w-16" :profile="profile" />
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
