<script setup lang="ts">
import type { SubStep } from '@/types/contract/LocationWizard';
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
import FileUpload from 'primevue/fileupload';
import InputText from 'primevue/inputtext';
import { computed, onMounted, ref, watchEffect } from 'vue';

const images = defineModel<CreateImageRequest[]>({ required: true, default: () => [] });
const substeps = defineModel<SubStep[]>('substeps', { default: [] });

const showAddDialog = ref(false);
const urlInput = ref('');
const draggedIndex = ref<number | null>(null);

const canAddMore = computed(() => images.value.length < 10);
const primaryImage = computed(() => images.value.find((img) => img.isPrimary));
const secondaryImages = computed(() => images.value.filter((img) => !img.isPrimary));
const primaryImageIndex = computed(() => images.value.findIndex((img) => img.isPrimary) || 0);

onMounted(() => {
    if (images.value.length === 0) {
        showAddDialog.value = true;
    }
});

// Populate substeps for sidebar display
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
    return images.value.findIndex((img) => img.imageUrl === image.imageUrl);
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

    // If we removed the primary image, make the first one primary
    if (removedImage.isPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true;
    }

    // Reorder
    newImages.forEach((img, idx) => {
        img.order = idx;
        if (removedImage.isPrimary && idx === 0) {
            img.isPrimary = true;
        }
    });

    images.value = newImages;
}

function setPrimary(index: number): void {
    const newImages = images.value.map((img, idx) => ({
        ...img,
        isPrimary: idx === index,
    }));

    images.value = newImages;
}

function handleFileUpload(event: any): void {
    const files = event.files;

    if (!files || files.length === 0) return;

    // Calculate how many files we can actually add
    const remainingSlots = 10 - images.value.length;
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

    newImages.forEach((img, idx) => {
        img.order = idx;
    });

    images.value = newImages;
    draggedIndex.value = null;
}

function onDragEnd(): void {
    draggedIndex.value = null;
}
</script>

<template>
    <div class="rounded-lg border-2 border-slate-200 bg-white p-6">
        <div class="space-y-6">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div
                        class="bg-secondary-100 flex h-10 w-10 items-center justify-center rounded-full">
                        <FontAwesomeIcon :icon="faImage" class="text-secondary-600" />
                    </div>
                    <div>
                        <h3 class="text-xl font-semibold text-gray-900">Afbeeldingen</h3>
                        <p class="text-sm text-gray-600">
                            Voeg afbeeldingen toe van uw locatie
                            <span class="ml-2 text-gray-500">({{ images.length }}/10)</span>
                        </p>
                    </div>
                </div>

                <Button v-if="canAddMore" @click="openAddDialog" size="small" text class="p-2">
                    <FontAwesomeIcon :icon="faPlus" />
                </Button>
            </div>

            <!-- Images Gallery -->
            <div v-if="images.length > 0" class="space-y-4">
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
                            class="primary-image__img"
                            v-if="primaryImage.tempUrl" />

                        <!-- Primary Badge -->
                        <div class="primary-badge">
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
                <div
                    v-if="secondaryImages.length > 0 || canAddMore"
                    class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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
                            class="secondary-image__img"
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
                        <div
                            class="absolute right-2 bottom-2 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white">
                            {{ index + 2 }}
                        </div>
                    </div>

                    <!-- Add New Image Placeholder -->
                    <div v-if="canAddMore" class="add-image-placeholder" @click="openAddDialog">
                        <div class="text-center">
                            <FontAwesomeIcon :icon="faPlus" class="mb-2 h-8 w-8 text-gray-400" />
                            <div class="text-xs text-gray-500">Voeg toe</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Add Images -->
            <div v-if="canAddMore && images.length === 0" class="space-y-3">
                <div
                    class="hover:border-primary-400 hover:bg-primary-50 flex h-48 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors duration-200"
                    @click="openAddDialog">
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
        </div>
    </div>

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
                    <div
                        class="bg-primary-100 text-primary-600 flex h-10 w-10 items-center justify-center rounded-full">
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
                    JPG, PNG, GIF • Max. 10MB per bestand • Tot {{ 10 - images.length }} bestanden
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
                    <div
                        class="bg-secondary-100 text-secondary-600 flex h-10 w-10 items-center justify-center rounded-full">
                        <FontAwesomeIcon :icon="faLink" />
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-900">URL opgeven</h4>
                        <p class="text-sm text-gray-500">Directe link naar een afbeelding</p>
                    </div>
                </div>
                <InputText
                    v-model="urlInput"
                    placeholder="https://example.com/image.jpg"
                    class="w-full"
                    @keyup.enter="addImageFromUrl" />
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

.primary-image {
    @apply relative cursor-move overflow-hidden rounded-lg bg-gray-100;
    @apply aspect-[16/9];
}

.primary-image__img {
    @apply h-full w-full object-cover;
    @apply transition-transform duration-200 group-hover:scale-105;
}

.primary-badge {
    @apply absolute top-3 right-3 flex items-center gap-1 rounded-full px-2 py-1;
    @apply bg-white text-sm font-medium;
}

.secondary-image {
    @apply relative aspect-square cursor-move overflow-hidden rounded-lg bg-gray-100;
}

.secondary-image__img {
    @apply h-full w-full object-cover;
    @apply transition-transform duration-200 group-hover:scale-105;
}

.image-actions {
    @apply absolute inset-0 flex items-center justify-center;
    @apply bg-black/0 transition-all duration-200 group-hover:bg-black/40;
}

.image-actions__buttons {
    @apply flex gap-2 opacity-0;
    @apply transition-opacity duration-200 group-hover:opacity-100;
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

.add-image-placeholder {
    @apply flex aspect-square cursor-pointer items-center justify-center rounded-lg;
    @apply border-2 border-dashed border-gray-300 bg-gray-50;
    @apply hover:border-primary-400 hover:bg-primary-50 transition-colors duration-200;
}
</style>
