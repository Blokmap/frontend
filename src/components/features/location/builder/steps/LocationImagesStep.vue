<script setup lang="ts">
import type { SubStep } from '@/components/features/location/builder/LocationBuilder.types';
import LocationBuilderCard from '@/components/features/location/builder/LocationBuilderCard.vue';
import { LOCATION_SETTINGS } from '@/constants/settings';
import type { CreateImageRequest } from '@/types/schema/Image';
import {
    faImage,
    faLink,
    faPlus,
    faStar,
    faTrash,
    faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload';
import InputText from 'primevue/inputtext';
import { computed, onMounted, ref, watchEffect } from 'vue';

const images = defineModel<CreateImageRequest[]>({ required: true, default: () => [] });
const substeps = defineModel<SubStep[]>('substeps', { default: [] });

const showAddDialog = ref(false);
const urlInput = ref('');
const draggedImage = ref<CreateImageRequest | null>(null);
const isDragging = ref(false);

const canAddMore = computed(() => images.value.length < LOCATION_SETTINGS.MAX_IMAGES);
const primaryImage = computed(() => images.value.find((img) => img.isPrimary));
const secondaryImages = computed(() =>
    images.value.filter((img) => !img.isPrimary).sort((a, b) => a.order - b.order),
);
const sortedImages = computed(() => [...images.value].sort((a, b) => a.order - b.order));
const primaryImageIndex = computed(() => sortedImages.value.findIndex((img) => img.isPrimary));

onMounted(() => {
    if (images.value.length === 0) {
        showAddDialog.value = true;
    }
});

watchEffect(() => {
    const data = images.value;
    const hasPrimaryImage = data.some((img) => img.isPrimary);
    const hasImages = data.length > 0;

    substeps.value = [
        {
            label: 'Afbeeldingen toevoegen',
            isCompleted: hasImages,
        },
        {
            label: 'Hoofdafbeelding instellen',
            isCompleted: hasPrimaryImage,
        },
    ];
});

function getImageIndex(image: CreateImageRequest): number {
    return sortedImages.value.findIndex((img) => img === image);
}

function getImageOrder(image: CreateImageRequest): number {
    return image.order;
}

function addImageFromUrl(): void {
    if (!urlInput.value || !canAddMore.value) return;

    const maxOrder =
        images.value.length > 0 ? Math.max(...images.value.map((img) => img.order)) : -1;

    images.value = [
        ...images.value,
        {
            imageUrl: urlInput.value,
            tempUrl: urlInput.value,
            isPrimary: images.value.length === 0,
            order: maxOrder + 1,
        },
    ];

    showAddDialog.value = false;
}

function removeImage(index: number): void {
    const imageToRemove = sortedImages.value[index];
    if (!imageToRemove) return;

    const newImages = images.value.filter((img) => img !== imageToRemove);

    if (imageToRemove.isPrimary && newImages.length > 0) {
        // Find the image with the lowest order to make primary
        const newPrimary = newImages.reduce((min, img) => (img.order < min.order ? img : min));
        newPrimary.isPrimary = true;
    }

    images.value = newImages;
}

function setPrimary(index: number): void {
    const targetImage = sortedImages.value[index];
    if (!targetImage) return;

    for (const img of images.value) {
        img.isPrimary = img === targetImage;
    }
}

function handleFileUpload(event: FileUploadSelectEvent): void {
    const files = event.files;
    if (!files || files.length === 0) return;

    const remainingSlots = LOCATION_SETTINGS.MAX_IMAGES - images.value.length;
    const filesToAdd = files.slice(0, remainingSlots);

    const maxOrder =
        images.value.length > 0 ? Math.max(...images.value.map((img) => img.order)) : -1;

    const newImages = filesToAdd.map((file: File, index: number): CreateImageRequest => {
        const tempUrl = URL.createObjectURL(file);
        const isPrimary = images.value.length === 0 && index === 0;
        const order = maxOrder + 1 + index;

        return {
            tempUrl,
            file,
            isPrimary,
            order,
        };
    });

    images.value = [...images.value, ...newImages];
    showAddDialog.value = false;
}

function openAddDialog(): void {
    showAddDialog.value = true;
    urlInput.value = '';
}

function onDragStart(event: DragEvent, index: number): void {
    const image = sortedImages.value[index];
    if (!image) return;

    draggedImage.value = image;
    isDragging.value = true;
    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', ''); // For iOS compatibility
    }
}

function onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
    }
}

function onDrop(event: DragEvent, targetIndex: number): void {
    event.preventDefault();

    if (!draggedImage.value) return;

    const targetImage = sortedImages.value[targetIndex];
    if (!targetImage || draggedImage.value === targetImage) {
        return;
    }

    const draggedOrder = draggedImage.value.order;
    const targetOrder = targetImage.order;

    // Swap the order values
    draggedImage.value.order = targetOrder;
    targetImage.order = draggedOrder;

    // Force reactivity update
    images.value = [...images.value];
}

function onDragEnd(): void {
    draggedImage.value = null;
    isDragging.value = false;
}

function onTouchStart(event: TouchEvent, index: number): void {
    const image = sortedImages.value[index];
    if (!image) return;

    draggedImage.value = image;
    isDragging.value = true;
}

function onTouchEnd(): void {
    draggedImage.value = null;
    isDragging.value = false;
}
</script>

<template>
    <LocationBuilderCard :icon="faImage">
        <template #header>
            <h3 class="text-xl font-semibold text-gray-900">Afbeeldingen</h3>
            <p class="text-sm text-gray-600">
                Voeg afbeeldingen toe van uw locatie
                <span class="ml-2 text-gray-500">({{ images.length }}/10)</span>
            </p>
        </template>
        <template #default>
            <!-- Images Gallery -->
            <template v-if="images.length > 0">
                <!-- Main Image (Primary) -->
                <div v-if="primaryImage" class="relative overflow-hidden rounded-lg">
                    <div
                        class="primary-image group"
                        :class="{ dragging: isDragging && draggedImage === primaryImage }"
                        draggable="true"
                        @dragstart="onDragStart($event, primaryImageIndex)"
                        @dragover="onDragOver"
                        @drop="onDrop($event, primaryImageIndex)"
                        @dragend="onDragEnd"
                        @touchstart="onTouchStart($event, primaryImageIndex)"
                        @touchend="onTouchEnd">
                        <img
                            :src="primaryImage.tempUrl"
                            alt="Hoofdafbeelding"
                            v-if="primaryImage.tempUrl" />

                        <!-- Primary Badge -->
                        <div class="primary-image__badge">
                            <FontAwesomeIcon :icon="faStar" class="h-3 w-3" />
                            Hoofdafbeelding
                        </div>

                        <!-- Actions -->
                        <div class="image-actions">
                            <div class="image-actions__buttons">
                                <Button
                                    @click.stop="removeImage(primaryImageIndex)"
                                    size="small"
                                    severity="danger"
                                    class="action-button action-button--danger"
                                    rounded>
                                    <FontAwesomeIcon :icon="faTrash" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Additional Images Grid -->
                <div v-if="secondaryImages.length > 0 || canAddMore" class="images-grid">
                    <TransitionGroup tag="div" class="contents">
                        <div
                            v-for="(image, index) in secondaryImages"
                            :key="image.tempUrl || image.imageUrl || index"
                            class="secondary-image group"
                            :class="{
                                dragging: isDragging && draggedImage === image,
                            }"
                            draggable="true"
                            @dragstart="onDragStart($event, getImageIndex(image))"
                            @dragover="onDragOver"
                            @drop="onDrop($event, getImageIndex(image))"
                            @dragend="onDragEnd"
                            @touchstart="onTouchStart($event, getImageIndex(image))"
                            @touchend="onTouchEnd">
                            <img
                                :src="image.tempUrl"
                                :alt="`Afbeelding ${index + 2}`"
                                v-if="image.tempUrl" />

                            <!-- Actions -->
                            <div class="image-actions">
                                <div class="image-actions__buttons">
                                    <Button
                                        @click.stop="setPrimary(getImageIndex(image))"
                                        size="small"
                                        severity="secondary"
                                        class="action-button action-button--secondary"
                                        rounded>
                                        <FontAwesomeIcon :icon="faStar" />
                                    </Button>
                                    <Button
                                        @click.stop="removeImage(getImageIndex(image))"
                                        size="small"
                                        severity="danger"
                                        class="action-button action-button--danger"
                                        rounded>
                                        <FontAwesomeIcon :icon="faTrash" />
                                    </Button>
                                </div>
                            </div>

                            <!-- Index Number -->
                            <div class="image-index">
                                {{ index + 2 }}
                            </div>
                        </div>
                    </TransitionGroup>

                    <!-- Add New Image Placeholder -->
                    <div v-if="canAddMore" class="add-placeholder" @click="openAddDialog">
                        <div class="text-center">
                            <FontAwesomeIcon :icon="faPlus" class="mb-2 h-8 w-8 text-gray-400" />
                            <div class="text-xs text-gray-500">Voeg toe</div>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Add Images -->
            <div v-if="canAddMore && images.length === 0" class="space-y-3">
                <div class="empty-placeholder" @click="openAddDialog">
                    <div class="text-center">
                        <FontAwesomeIcon :icon="faImage" class="mb-3 h-12 w-12 text-gray-400" />
                        <h4 class="text-lg font-medium text-gray-900">Voeg afbeeldingen toe</h4>
                        <p class="text-sm text-gray-500">
                            Klik hier om uw eerste afbeelding toe te voegen
                        </p>
                    </div>
                </div>
            </div>

            <!-- Help Text -->
            <p v-if="images.length > 1" class="text-center text-sm text-gray-500">
                Sleep afbeeldingen om de volgorde te wijzigen. Klik op de ster om een
                hoofdafbeelding in te stellen.
            </p>
        </template>
    </LocationBuilderCard>

    <!-- Add Image Dialog -->
    <Dialog
        v-model:visible="showAddDialog"
        header="Afbeelding toevoegen"
        :style="{ width: '400px' }"
        modal
        :draggable="false"
        :resizable="false">
        <div class="space-y-4">
            <!-- Upload Option -->
            <div class="space-y-3">
                <div class="flex items-center gap-3">
                    <div class="icon-container icon-container--primary">
                        <FontAwesomeIcon :icon="faUpload" />
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-900">Bestanden uploaden</h4>
                        <p class="text-sm text-gray-500">
                            Kies een of meerdere bestanden van uw computer
                        </p>
                    </div>
                </div>
                <FileUpload
                    mode="basic"
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    :multiple="true"
                    :auto="true"
                    choose-label="Selecteer bestanden"
                    class="w-full"
                    @select="handleFileUpload">
                    <template #chooseicon>
                        <FontAwesomeIcon :icon="faUpload" />
                    </template>
                </FileUpload>
                <div class="text-xs text-gray-500">
                    JPG, PNG, GIF • Max. 10MB per bestand • Tot
                    {{ LOCATION_SETTINGS.MAX_IMAGES - images.length }} bestanden
                </div>
            </div>

            <!-- Divider -->
            <div class="relative flex items-center justify-center">
                <div class="absolute inset-x-0 top-1/2 h-px bg-gray-200"></div>
                <span class="relative bg-white px-2 text-sm text-gray-500">of</span>
            </div>

            <!-- URL Option -->
            <div class="space-y-3">
                <div class="flex items-center gap-3">
                    <div class="icon-container icon-container--secondary">
                        <FontAwesomeIcon :icon="faLink" />
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-900">URL opgeven</h4>
                        <p class="text-sm text-gray-500">Directe link naar een afbeelding</p>
                    </div>
                </div>
                <InputText
                    v-model="urlInput"
                    class="w-full"
                    placeholder="https://example.com/image.jpg"
                    @keyup.enter="addImageFromUrl">
                </InputText>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end gap-3">
                <Button @click="showAddDialog = false" severity="secondary" outlined size="small">
                    Annuleren
                </Button>
                <Button @click="addImageFromUrl" :disabled="!urlInput" size="small">
                    <FontAwesomeIcon :icon="faPlus" class="mr-2" />
                    Toevoegen
                </Button>
            </div>
        </template>
    </Dialog>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.icon-container {
    @apply flex h-10 w-10 items-center justify-center rounded-full;

    &.icon-container--secondary {
        @apply bg-secondary-100;
    }

    &.icon-container--primary {
        @apply bg-primary-100 text-primary-600;
    }
}

.primary-image {
    @apply relative overflow-hidden rounded-lg bg-gray-100;
    @apply aspect-[16/9] transition-all duration-200;
    @apply select-none;

    img {
        @apply h-full w-full object-cover;
        @apply transition-transform duration-200 group-hover:scale-105;
    }

    .primary-image__badge {
        @apply absolute top-3 right-3 flex items-center gap-1 rounded-full px-2 py-1;
        @apply bg-white text-sm font-medium;
    }
}

.images-grid {
    @apply grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4;
    @apply select-none;

    .secondary-image {
        @apply relative aspect-square cursor-move overflow-hidden rounded-lg bg-gray-100;
        @apply transition-all duration-200;

        &:active {
            @apply scale-95 opacity-80;
        }

        img {
            @apply h-full w-full object-cover;
            @apply transition-transform duration-200 group-hover:scale-105;
        }

        &.dragging {
            @apply scale-95 opacity-50;
        }
    }
}

.image-index {
    @apply absolute right-2 bottom-2 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white;
}

.image-actions {
    @apply absolute inset-0 flex items-center justify-center;
    @apply bg-black/0 transition-all duration-200;
    @apply active:bg-black/40 md:hover:bg-black/40;

    .image-actions__buttons {
        @apply flex gap-2;
        @apply opacity-80 md:opacity-0 md:group-hover:opacity-100;
        @apply transition-opacity duration-200;
    }
}

@media (pointer: coarse) {
    .primary-image,
    .secondary-image {
        @apply touch-manipulation;
    }

    .image-actions__buttons {
        @apply opacity-90; /* More visible on touch devices */
    }
}

.action-button {
    @apply !bg-white/90 hover:!bg-white;
}

.action-button--danger {
    @apply !text-red-600;
}

.action-button--secondary {
    @apply !text-gray-700;
}

.add-placeholder {
    @apply flex aspect-square cursor-pointer items-center justify-center rounded-lg;
    @apply border-2 border-dashed border-gray-300 bg-gray-50;
    @apply hover:border-primary-400 hover:bg-primary-50 transition-colors duration-200;
}

.empty-placeholder {
    @apply flex h-48 cursor-pointer items-center justify-center rounded-lg;
    @apply border-2 border-dashed border-gray-300;
    @apply hover:border-primary-400 hover:bg-primary-50 transition-colors duration-200;
}
</style>
