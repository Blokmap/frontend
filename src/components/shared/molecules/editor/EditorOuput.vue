<script lang="ts" setup>
import { computed } from 'vue';
import { toEditorData } from '@/domain/editor/editorHelpers';
import type { OutputData } from '@editorjs/editorjs';

const props = defineProps<{
    data?: OutputData | string | null;
}>();

const data = computed<OutputData>(() => {
    return toEditorData(props.data);
});
</script>

<template>
    <template v-for="block in data.blocks">
        <template v-if="block.type.toLowerCase() === 'paragraph'">
            <p :key="block.id" class="ce-paragraph" v-html="block.data.text"></p>
        </template>
        <template v-else-if="block.type.toLowerCase() === 'header'">
            <component :is="`h${block.data.level}`" :key="block.id" class="ce-header">
                {{ block.data.text }}
            </component>
        </template>
        <template v-else-if="block.type.toLowerCase() === 'list'">
            <ul v-if="block.data.style === 'unordered'" :key="`${block.id}-ul`" class="cdx-list">
                <li v-for="(item, index) in block.data.items" :key="index" class="cdx-list__item">
                    {{ item.content }}
                </li>
            </ul>
            <ol v-else :key="`${block.id}-ol`" class="cdx-list">
                <li v-for="(item, index) in block.data.items" :key="index" class="cdx-list__item">
                    {{ item.content }}
                </li>
            </ol>
        </template>
    </template>
</template>
