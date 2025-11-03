<script setup lang="ts">
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload';
import InputText from 'primevue/inputtext';
import LocationBuilderCard from '@/components/features/location/builder/LocationBuilderCard.vue';
import {
    faImage,
    faLink,
    faPlus,
    faStar,
    faTrash,
    faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, onMounted, ref, watchEffect } from 'vue';
import {
    MAX_IMAGE_SIZE,
    SUPPORTED_IMAGE_FORMAT_NAES,
    SUPPORTED_IMAGE_FORMATS,
} from '@/domain/image/constants';
import { LOCATION_SETTINGS } from '@/domain/location';
import type { BuilderSubstep } from '@/components/features/location/builder';
import type { ImageBody } from '@/domain/image';

const images = defineModel<ImageBody[]>({ required: true, default: () => [] });
const substeps = defineModel<BuilderSubstep[]>('substeps', { default: [] });

const urlInput = ref('');
const draggedImage = ref<ImageBody | null>(null);

const showAddDialog = ref(false);
const isDragging = ref(false);

const canAddMore = computed(() => images.value.length < LOCATION_SETTINGS.MAX_IMAGES);

const sortedImages = computed(() =>
    [...images.value].sort((a, b) => (a.index ?? 0) - (b.index ?? 0)),
);

const primaryImage = computed(() => images.value.find((img) => img.index === 0));
const secondaryImages = computed(() => sortedImages.value.filter((img) => img.index !== 0));

onMounted(() => {
    if (images.value.length === 0) {
        showAddDialog.value = true;
    }
});

watchEffect(() => {
    substeps.value = [
        {
            label: 'Afbeeldingen toevoegen',
            isCompleted: images.value.length > 0,
        },
        {
            label: 'Hoofdafbeelding instellen',
            isCompleted: images.value.length > 0,
        },
    ];
});

/**
 * Add image from URL input. This will reset the URL input and close the dialog.
 */
function addImageFromUrl(): void {
    if (!urlInput.value || !canAddMore.value) return;

    images.value.push({
        imageUrl: urlInput.value,
        tempUrl: urlInput.value,
        isPrimary: images.value.length === 0,
        index: images.value.length,
    });

    urlInput.value = '';
    showAddDialog.value = false;
}

/**
 * Remove image by its index in the images array.
 *
 * @param imageIndex - The index of the image to remove.
 */
function removeImage(imageIndex: number): void {
    images.value = images.value.filter((img) => img.index !== imageIndex);

    sortedImages.value.forEach((img, i) => {
        img.index = i;
        img.isPrimary = i === 0;
    });
}

/**
 * Set an image as primary by its index in the images array.
 *
 * @param imageIndex - The index of the image to set as primary.
 */
function setPrimary(imageIndex: number): void {
    images.value.forEach((img) => {
        if (img.index === imageIndex) {
            img.index = 0;
            img.isPrimary = true;
        } else if ((img.index ?? 0) < imageIndex) {
            img.index = (img.index ?? 0) + 1;
            img.isPrimary = false;
        }
    });
}

/**
 * Handle file upload event from FileUpload component.
 *
 * @param event The file upload select event.
 */
function handleFileUpload(event: FileUploadSelectEvent): void {
    if (!event.files?.length) return;

    const startIndex = images.value.length;

    const newImages = event.files
        .slice(0, LOCATION_SETTINGS.MAX_IMAGES - startIndex)
        .map((file: File, i: number) => ({
            tempUrl: URL.createObjectURL(file),
            file,
            isPrimary: startIndex + i === 0,
            index: startIndex + i,
        }));

    images.value.push(...newImages);
    showAddDialog.value = false;
}

/**
 * Open the add image dialog.
 */
function openAddDialog(): void {
    showAddDialog.value = true;
    urlInput.value = '';
}

/**
 * Handle drag start event for an image.
 *
 * @param event The drag event.
 * @param imageIndex The index of the image being dragged.
 */
function onDragStart(event: DragEvent, imageIndex: number): void {
    const image = images.value.find((img) => img.index === imageIndex);
    if (!image) return;

    draggedImage.value = image;
    isDragging.value = true;
    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', '');
    }
}

/**
 * Handle drag over event for an image.
 *
 * @param event The drag event.
 */
function onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
    }
}

/**
 * Handle drop event for an image.
 *
 * @param event The drag event.
 * @param targetImageIndex The index of the target image where the dragged image is dropped.
 */
function onDrop(event: DragEvent, targetImageIndex: number): void {
    event.preventDefault();

    if (!draggedImage.value) return;

    const targetImage = images.value.find((img) => img.index === targetImageIndex);
    if (!targetImage || draggedImage.value === targetImage) return;

    const draggedIndex = draggedImage.value.index ?? 0;
    const targetIdx = targetImage.index ?? 0;

    // Swap the indices
    draggedImage.value.index = targetIdx;
    targetImage.index = draggedIndex;

    // Update isPrimary flags based on new indices
    images.value.forEach((img) => {
        img.isPrimary = img.index === 0;
    });

    // Force reactivity update
    images.value = [...images.value];
}

/**
 * Handle drag end event for an image.
 */
function onDragEnd(): void {
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
                    <div class="primary-image">
                        <img
                            v-if="primaryImage.tempUrl"
                            :src="primaryImage.tempUrl"
                            alt="Hoofdafbeelding" />

                        <!-- Primary Badge -->
                        <div class="primary-image__badge">
                            <FontAwesomeIcon :icon="faStar" class="h-3 w-3" />
                            Hoofdafbeelding
                        </div>

                        <!-- Actions -->
                        <div class="image-actions">
                            <div class="image-actions__buttons">
                                <Button
                                    size="small"
                                    severity="danger"
                                    class="action-button action-button--danger"
                                    rounded
                                    @click.stop="removeImage(0)">
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
                            @dragstart="onDragStart($event, image.index ?? 0)"
                            @dragover="onDragOver"
                            @drop="onDrop($event, image.index ?? 0)"
                            @dragend="onDragEnd"
                            draggable>
                            <img
                                v-if="image.tempUrl"
                                :src="image.tempUrl"
                                :alt="`Afbeelding ${index + 2}`" />

                            <!-- Actions -->
                            <div class="image-actions">
                                <div class="image-actions__buttons">
                                    <Button
                                        size="small"
                                        severity="secondary"
                                        class="action-button action-button--secondary"
                                        rounded
                                        @click.stop="setPrimary(image.index ?? 0)">
                                        <FontAwesomeIcon :icon="faStar" />
                                    </Button>
                                    <Button
                                        size="small"
                                        severity="danger"
                                        class="action-button action-button--danger"
                                        rounded
                                        @click.stop="removeImage(image.index ?? 0)">
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
                    :accept="SUPPORTED_IMAGE_FORMATS.join(',')"
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
                    {{ SUPPORTED_IMAGE_FORMAT_NAES.join(', ') }} • Max. {{ MAX_IMAGE_SIZE }} per
                    bestand • Tot {{ LOCATION_SETTINGS.MAX_IMAGES - images.length }} bestanden
                </div>
            </div>

            <!-- Divider -->
            <div class="relative flex items-center justify-center">
                <div class="absolute inset-x-0 top-1/2 h-px bg-gray-200" />
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
                    @keyup.enter="addImageFromUrl" />
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end gap-3">
                <Button severity="secondary" outlined size="small" @click="showAddDialog = false">
                    Annuleren
                </Button>
                <Button :disabled="!urlInput" size="small" @click="addImageFromUrl">
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
    @apply border-1 border-dashed border-gray-300 bg-gray-50;
    @apply hover:border-primary-400 hover:bg-primary-50 transition-colors duration-200;
}

.empty-placeholder {
    @apply flex h-48 cursor-pointer items-center justify-center rounded-lg;
    @apply border-1 border-dashed border-gray-300;
    @apply hover:border-primary-400 hover:bg-primary-50 transition-colors duration-200;
}
</style>
