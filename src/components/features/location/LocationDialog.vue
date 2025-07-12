<script lang="ts" setup>
import Gallery from '@/components/shared/Gallery.vue';
import { useLocation } from '@/composables/services/useLocations';
import Dialog from 'primevue/dialog';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
    locationId: string;
}>();

const { locale } = useI18n();
const locationQuery = useLocation(props.locationId);

const location = computed(() => locationQuery.data.value);
</script>

<template>
    <Dialog
        class="mx-4 w-[1080px] max-w-full"
        :visible="showLocationDialog"
        :draggable="false"
        modal>
        <template v-if="location !== null" #header>
            <h2 class="text-2xl font-bold">{{ selectedLocation?.name }}</h2>
        </template>
        <template v-if="location !== null" #default>
            <Gallery :images="location.images" />
            <div class="my-5 flex gap-3">
                <div class="flex w-2/3 flex-col gap-4">
                    <h2 class="text-2xl font-bold">{{ selectedLocation?.name }}</h2>
                    <p class="text-lg text-slate-600">
                        {{ selectedLocation?.description?.[locale] }}
                    </p>
                </div>
                <div class="w-1/3">
                    <h2 class="text-2xl font-bold">Availability</h2>
                </div>
            </div>
        </template>
    </Dialog>
</template>
