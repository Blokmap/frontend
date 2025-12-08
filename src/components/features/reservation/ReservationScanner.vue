<script lang="ts" setup>
import ReservationScannerOverlay from '@/components/features/reservation/ReservationScannerOverlay.vue';
import { useSound } from '@vueuse/sound';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ping from '@/assets/sounds/ping.mp3';
import { useScanProfile } from '@/composables/data/useProfile';
import { useToast } from '@/composables/store/useToast';
import type { Location } from '@/domain/location';
import type { Result } from '@zxing/library';

const props = defineProps<{
    location: Location;
}>();

const visible = defineModel<boolean>('visible', { required: true });

const { t } = useI18n();
const toast = useToast();
const sound = useSound(ping, { volume: 3 });

const successfullProfileScans = ref<string[]>([]);

const { mutateAsync: scanProfile, isPending } = useScanProfile({
    onSuccess: onScanSuccess,
    onError: () => {
        toast.add({
            severity: 'error',
            summary: t('domains.profiles.errors.scanFailed'),
            detail: t('domains.profiles.errors.scanFailedDetail'),
        });
    },
});

async function onScan(result: Result): Promise<void> {
    const profileId = result.getText();

    // Ignore scan if already processing
    if (isPending.value) {
        return;
    }

    // Ignore scan if recently scanned
    if (successfullProfileScans.value.includes(profileId)) {
        return onScanSuccess(profileId);
    }

    await scanProfile({
        profileId,
        request: {
            locationId: props.location.id,
            day: new Date(),
        },
    });
}

function onScanSuccess(id: string): void {
    const toastId = `scan-success-${id}`;

    if (toast.hasVisibleToast(toastId)) {
        return;
    }

    successfullProfileScans.value.push(id);

    if (navigator.vibrate) {
        navigator.vibrate(500);
    }

    sound.play();

    toast.add({
        id: toastId,
        severity: 'success',
        summary: t('domains.profiles.success.scanSuccessful'),
        detail: t('domains.profiles.success.scanSuccessfulDetail'),
    });
}

function onClose(): void {
    visible.value = false;
}
</script>

<template>
    <Teleport to="body">
        <ReservationScannerOverlay v-model:visible="visible" @scan="onScan" @close="onClose" />
    </Teleport>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
