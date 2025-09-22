import { ref, computed } from 'vue';

type ScanMode = 'qr' | 'barcode';

export function useProfileScan() {
    const scanMode = ref<ScanMode>('qr');

    // Simple computed property for camera support
    const isCameraSupported = computed(() => {
        return 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
    });

    function toggleScanMode() {
        scanMode.value = scanMode.value === 'qr' ? 'barcode' : 'qr';
    }

    async function openCamera() {
        if (!isCameraSupported.value) {
            console.warn('Camera not supported on this device');
            return;
        }

        try {
            // TODO: Implement camera functionality for scanning location codes
            console.log('Opening camera for scanning...');
        } catch (error) {
            console.error('Failed to open camera:', error);
        }
    }

    const currentCodeUrl = computed(() => {
        return scanMode.value === 'qr'
            ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/QR_Code_Example.svg/1200px-QR_Code_Example.svg.png'
            : 'https://www.computalabel.com/Images/C128.png';
    });

    return {
        scanMode,
        isCameraSupported,
        currentCodeUrl,
        toggleScanMode,
        openCamera,
    };
}
