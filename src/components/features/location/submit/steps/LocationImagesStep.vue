<script setup lang="ts">
import LocationSubmitCard from '@/components/features/location/submit/LocationSubmitCard.vue';
import type { SubStep } from '@/types/contract/LocationWizard';
import type { CreateImageRequest } from '@/types/schema/Image';
import { maxLocationImages } from '@/utils/schema/location';
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
const draggedIndex = ref<number | null>(null);

const canAddMore = computed(() => images.value.length < maxLocationImages);
const primaryImage = computed(() => images.value.find((img) => img.isPrimary));
const secondaryImages = computed(() => images.value.filter((img) => !img.isPrimary));
const primaryImageIndex = computed(() => images.value.findIndex((img) => img.isPrimary) || 0);

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
    return images.value.findIndex((img) => img === image);
}

function addImageFromUrl(): void {
    if (!urlInput.value || !canAddMore.value) return;

    images.value = [
        ...images.value,
        {
            imageUrl: urlInput.value,
            tempUrl: urlInput.value,
            isPrimary: images.value.length === 0,
            order: images.value.length,
        },
    ];

    showAddDialog.value = false;
}

function removeImage(index: number): void {
    const newImages = [...images.value];
    const removedImage = newImages[index];
    newImages.splice(index, 1);

    if (removedImage.isPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true;
    }

    for (let i = 0; i < newImages.length; i++) {
        newImages[i].order = i;

        if (removedImage.isPrimary && i === 0) {
            newImages[i].isPrimary = true;
        }
    }

    images.value = newImages;
}

function setPrimary(index: number): void {
    for (let i = 0; i < images.value.length; i++) {
        images.value[i].isPrimary = i === index;
    }
}

function handleFileUpload(event: FileUploadSelectEvent): void {
    const files = event.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxLocationImages - images.value.length;
    const filesToAdd = files.slice(0, remainingSlots);

    const newImages = filesToAdd.map((file: File, index: number): CreateImageRequest => {
        const tempUrl = URL.createObjectURL(file);
        const isPrimary = images.value.length === 0 && index === 0;
        const order = images.value.length + index;

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
    draggedIndex.value = index;
    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
    }
}

function onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
    }
}

function onDrop(event: DragEvent, targetIndex: number): void {
    if (!draggedIndex.value && draggedIndex.value !== 0) return;
    if (draggedIndex.value === targetIndex) return;
    event.preventDefault();

    const newImages = [...images.value];
    const draggedImage = newImages[draggedIndex.value];

    newImages.splice(draggedIndex.value, 1);

    const insertIndex = draggedIndex.value < targetIndex ? targetIndex - 1 : targetIndex;
    newImages.splice(insertIndex, 0, draggedImage);

    for (let i = 0; i < newImages.length; i++) {
        newImages[i].order = i;
    }

    images.value = newImages;
    draggedIndex.value = null;
}

function onDragEnd(): void {
    draggedIndex.value = null;
}
</script>

<template>
    <LocationSubmitCard :icon="faImage">
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
                        draggable="true"
                        @dragstart="onDragStart($event, primaryImageIndex)"
                        @dragover="onDragOver"
                        @drop="onDrop($event, 0)"
                        @dragend="onDragEnd">
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
                    <div
                        v-for="(image, index) in secondaryImages"
                        :key="`secondary-${index}`"
                        class="secondary-image group"
                        draggable="true"
                        @dragstart="onDragStart($event, getImageIndex(image))"
                        @dragover="onDragOver"
                        @drop="onDrop($event, getImageIndex(image))"
                        @dragend="onDragEnd">
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
                                    class="image-actions__button image-actions__button--secondary"
                                    rounded>
                                    <FontAwesomeIcon :icon="faStar" />
                                </Button>
                                <Button
                                    @click.stop="removeImage(getImageIndex(image))"
                                    size="small"
                                    severity="danger"
                                    class="actions__button actions__button--danger"
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
            <p v-if="images.length > 0" class="text-center text-sm text-gray-500">
                Sleep afbeeldingen om de volgorde te wijzigen. Klik op de ster om een
                hoofdafbeelding in te stellen.
            </p>
        </template>
    </LocationSubmitCard>

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
                    {{ maxLocationImages - images.length }} bestanden
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
                <InputText v-model="urlInput" class="w-full" @keyup.enter="addImageFromUrl">
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

/* Icon containers used throughout the component */
.icon-container {
    @apply flex h-10 w-10 items-center justify-center rounded-full;
}

.icon-container--secondary {
    @apply bg-secondary-100;
}

.icon-container--primary {
    @apply bg-primary-100 text-primary-600;
}

/* Images grid layout */
.images-grid {
    @apply grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4;
}

/* Primary image block with nested elements */
.primary-image {
    @apply relative cursor-move overflow-hidden rounded-lg bg-gray-100;
    @apply aspect-[16/9];

    img {
        @apply h-full w-full object-cover;
        @apply transition-transform duration-200 group-hover:scale-105;
    }
}

.primary-image__badge {
    @apply absolute top-3 right-3 flex items-center gap-1 rounded-full px-2 py-1;
    @apply bg-white text-sm font-medium;
}

/* Secondary image block with nested elements */
.secondary-image {
    @apply relative aspect-square cursor-move overflow-hidden rounded-lg bg-gray-100;

    img {
        @apply h-full w-full object-cover;
        @apply transition-transform duration-200 group-hover:scale-105;
    }
}

/* Image index nested under secondary-image */
.image-index {
    @apply absolute right-2 bottom-2 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white;
}

/* Image actions overlay block with nested elements */
.image-actions {
    @apply absolute inset-0 flex items-center justify-center;
    @apply bg-black/0 transition-all duration-200 group-hover:bg-black/40;
}

.image-actions__buttons {
    @apply flex gap-2 opacity-0;
    @apply transition-opacity duration-200 group-hover:opacity-100;
}

/* Action buttons - shared base styles */
.action-button,
.image-actions__button,
.actions__button {
    @apply !bg-white/90 hover:!bg-white;
}

/* Action button modifiers */
.action-button--danger,
.actions__button--danger {
    @apply !text-red-600;
}

.action-button--secondary,
.image-actions__button--secondary,
.actions__button--secondary {
    @apply !text-gray-700;
}

/* Placeholder blocks */
.add-placeholder {
    @apply flex aspect-square cursor-pointer items-center justify-center rounded-lg;
    @apply border-2 border-dashed border-gray-300 bg-gray-50;
    @apply hover:border-primary-400 hover:bg-primary-50 transition-colors duration-200;
}

.empty-placeholder {
    @apply hover:border-primary-400 hover:bg-primary-50 flex h-48 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors duration-200;
}
</style>
