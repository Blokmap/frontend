<script lang="ts" setup>
import EditorJS, { type API, type BlockMutationEvent, type OutputData } from '@editorjs/editorjs';
import List from '@editorjs/list';
import { useDebounceFn } from '@vueuse/core';
import { nextTick, onMounted, ref, useTemplateRef, watch } from 'vue';
import {
    getOutputBlocksLength,
    getOutputDataLength,
    toEditorData,
} from '@/domain/editor/editorHelpers';

const { maxLength } = defineProps<{
    maxLength?: number;
}>();

const model = defineModel<string | null | undefined>({
    required: true,
});

const editorRef = useTemplateRef<HTMLElement>('editor');
const editor = ref<EditorJS | null>(null);

const isReady = ref<boolean>(false);
const isUpdatingFromEditor = ref<boolean>(false);

// Debounced function to update the model
const debouncedUpdate = useDebounceFn(async (output: OutputData) => {
    isUpdatingFromEditor.value = true;
    model.value = JSON.stringify(output);
    await nextTick();
    isUpdatingFromEditor.value = false;
}, 300);

// Watch for external changes to the model
watch(model, async (newValue) => {
    if (isUpdatingFromEditor.value || !isReady.value || !editor.value) return;
    const newData = toEditorData(newValue);
    await editor.value.render?.(newData);
});

onMounted(() => {
    if (!editorRef.value) return;

    editor.value = new EditorJS({
        holder: editorRef.value,
        data: toEditorData(model.value),
        tools: {
            list: {
                class: List,
                config: {
                    maxLevel: 1,
                    defaultStyle: 'unordered',
                },
                toolbox: [
                    {
                        icon: '1.',
                        title: 'Ordered List',
                        data: {
                            style: 'ordered',
                        },
                    },
                    {
                        icon: '•',
                        title: 'Unordered List',
                        data: {
                            style: 'unordered',
                        },
                    },
                ],
            },
        },
        onChange: async (api: API, event: BlockMutationEvent) => {
            const output = await api.saver.save();
            const length = getOutputDataLength(output);

            if (maxLength && length > maxLength) {
                const workingBlockId = event.detail.target.id;

                const workingBlock = output.blocks.find((block) => block.id === workingBlockId);
                const otherBlocks = output.blocks.filter((block) => block.id !== workingBlockId);

                const otherBlocksLength = getOutputBlocksLength(otherBlocks);
                const workingBlockLimit = maxLength - otherBlocksLength;

                if (workingBlock) {
                    await api.blocks.update(workingBlockId, {
                        text: workingBlock.data.text.substr(0, workingBlockLimit),
                    });

                    await nextTick();

                    api.caret.setToBlock(workingBlockId, 'end');
                }

                return;
            }

            debouncedUpdate(output);
        },
        onReady: () => {
            isReady.value = true;
        },
    });
});
</script>

<template>
    <div ref="editor"></div>
</template>
