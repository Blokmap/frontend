<script setup lang="ts">
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
import { computed, onMounted, ref } from 'vue';
import {
    MAX_IMAGE_SIZE,
    SUPPORTED_IMAGE_FORMAT_NAES,
    SUPPORTED_IMAGE_FORMATS,
} from '@/domain/image/imageConstants';
import { LOCATION_SETTINGS } from '@/domain/location';
import type { ImageBody } from '@/domain/image';

const images = defineModel<ImageBody[]>({ required: true, default: () => [] });

const urlInput = ref<string>('');
const draggedImage = ref<ImageBody | null>(null);

const showAddDialog = ref<boolean>(false);
const isDragging = ref<boolean>(false);

const canAddMore = computed<boolean>(() => images.value.length < LOCATION_SETTINGS.MAX_IMAGES);

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

/**
 * Add image from URL input. This will reset the URL input and close the dialog.
 */
function addImageFromUrl(): void {
    if (!urlInput.value || !canAddMore.value) return;

    images.value.push({
        imageUrl: urlInput.value,
        tempUrl: urlInput.value,
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
        } else if ((img.index ?? 0) < imageIndex) {
            img.index = (img.index ?? 0) + 1;
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
 * @param image The image being dragged.
 */
function onDragStart(event: DragEvent, image: ImageBody): void {
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
 * @param targetImage The target image where the dragged image is dropped.
 */
function onDrop(event: DragEvent, targetImage: ImageBody): void {
    event.preventDefault();

    if (!draggedImage.value || draggedImage.value === targetImage) return;

    // Get sorted array
    const sorted = [...images.value].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

    // Find positions in sorted array
    const draggedPos = sorted.findIndex((img) => img === draggedImage.value);
    const targetPos = sorted.findIndex((img) => img === targetImage);

    if (draggedPos === -1 || targetPos === -1) return;

    // Remove from old position
    const [removed] = sorted.splice(draggedPos, 1);

    // Insert at new position
    sorted.splice(targetPos, 0, removed);

    // Reassign all indices
    sorted.forEach((img, i) => {
        img.index = i;
    });

    // Update reactive array
    images.value = [...sorted];
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
                                <button
                                    class="action-button action-button--delete"
                                    @click.stop="removeImage(0)">
                                    <FontAwesomeIcon :icon="faTrash" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Additional Images Grid -->
                <div v-if="secondaryImages.length > 0 || canAddMore" class="images-grid">
                    <div
                        v-for="(image, index) in secondaryImages"
                        :key="image.tempUrl || image.imageUrl || `image-${index}`"
                        class="secondary-image group"
                        :class="{
                            dragging: isDragging && draggedImage === image,
                        }"
                        draggable="true"
                        @dragstart="onDragStart($event, image)"
                        @dragover="onDragOver"
                        @drop="onDrop($event, image)"
                        @dragend="onDragEnd">
                        <img
                            v-if="image.tempUrl"
                            :src="image.tempUrl"
                            :alt="`Afbeelding ${index + 2}`" />

                        <!-- Actions -->
                        <div class="image-actions" @mousedown.stop @touchstart.stop>
                            <div class="image-actions__buttons">
                                <button
                                    class="action-button action-button--star"
                                    @click.stop="setPrimary(image.index ?? 0)">
                                    <FontAwesomeIcon :icon="faStar" />
                                </button>
                                <button
                                    class="action-button action-button--delete"
                                    @click.stop="removeImage(image.index ?? 0)">
                                    <FontAwesomeIcon :icon="faTrash" />
                                </button>
                            </div>
                        </div>

                        <!-- Index Number -->
                        <div class="image-index">
                            {{ index + 2 }}
                        </div>
                    </div>

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

            <!-- Add Image Dialog -->
            <Teleport to="body">
                <Dialog
                    v-model:visible="showAddDialog"
                    header="Afbeelding toevoegen"
                    :style="{ width: '400px' }"
                    :draggable="false"
                    :resizable="false"
                    modal>
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
                                        Kies een of meerdere bestanden.
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
                                {{ SUPPORTED_IMAGE_FORMAT_NAES.join(', ') }} • Max.
                                {{ MAX_IMAGE_SIZE }} per bestand • Tot
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
                                    <p class="text-sm text-gray-500">
                                        Directe link naar een afbeelding
                                    </p>
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
                            <button
                                class="dialog-button dialog-button--secondary"
                                @click="showAddDialog = false">
                                Annuleren
                            </button>
                            <button
                                class="dialog-button dialog-button--primary"
                                :disabled="!urlInput"
                                @click="addImageFromUrl">
                                <FontAwesomeIcon :icon="faPlus" class="mr-2" />
                                Toevoegen
                            </button>
                        </div>
                    </template>
                </Dialog>
            </Teleport>
        </template>
    </LocationBuilderCard>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.icon-container {
    @apply flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg;

    &.icon-container--secondary {
        @apply bg-secondary-100;
    }

    &.icon-container--primary {
        @apply bg-primary-100 text-primary-600;
    }
}

.primary-image {
    @apply relative overflow-hidden rounded-lg bg-gray-100;
    @apply aspect-[16/9] transition-all duration-300;
    @apply select-none;

    img {
        @apply h-full w-full object-cover;
        @apply transition-transform duration-200 group-hover:scale-105;
    }

    .primary-image__badge {
        @apply absolute top-3 right-3 flex items-center gap-1 rounded-full px-2 py-1;
        @apply bg-white text-sm font-medium;
        @apply transition-all duration-200;
    }
}

.images-grid {
    @apply grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4;
    @apply select-none;

    .secondary-image {
        @apply relative aspect-square cursor-move overflow-hidden rounded-lg bg-gray-100;
        @apply transition-all duration-300;

        /* Smooth transitions for reordering */
        transition-property: transform, opacity, grid-column, grid-row;

        &:active {
            @apply scale-95 opacity-80;
        }

        img {
            @apply h-full w-full object-cover;
            @apply transition-transform duration-200 group-hover:scale-105;
        }

        &.dragging {
            @apply scale-95 opacity-50;
            transition-duration: 150ms;
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
    @apply flex h-9 w-9 items-center justify-center rounded-full;
    @apply bg-white/95 shadow-sm backdrop-blur-sm;
    @apply transition-all duration-200;
    @apply hover:scale-110 active:scale-95;
    @apply focus:ring-2 focus:ring-offset-2 focus:outline-none;

    &.action-button--delete {
        @apply text-red-600 hover:bg-red-50 hover:text-red-700;
        @apply focus:ring-red-500;
    }

    &.action-button--star {
        @apply text-yellow-500 hover:bg-yellow-50 hover:text-yellow-600;
        @apply focus:ring-yellow-500;
    }
}

.dialog-button {
    @apply rounded-lg px-4 py-2 font-medium;
    @apply transition-all duration-200;
    @apply focus:ring-2 focus:ring-offset-2 focus:outline-none;

    &.dialog-button--secondary {
        @apply bg-gray-100 text-gray-700;
        @apply hover:bg-gray-200 active:bg-gray-300;
        @apply focus:ring-gray-500;
    }

    &.dialog-button--primary {
        @apply bg-primary-600 text-white;
        @apply hover:bg-primary-700 active:bg-primary-800;
        @apply focus:ring-primary-500;
        @apply disabled:hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50;
    }
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
