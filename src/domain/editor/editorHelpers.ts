import { type OutputBlockData, type OutputData } from '@editorjs/editorjs';

/**
 * Converts a string to EditorJS OutputData format.
 *
 * @param input - The string to convert.
 * @returns The OutputData object containing the string as a paragraph block.
 */
export function toEditorData(input?: string | null | OutputData): OutputData {
    if (typeof input !== 'string') {
        return input || { blocks: [] };
    }

    const parsed = JSON.parse(input || '{}');

    if (parsed && parsed.blocks) {
        return parsed;
    }

    return {
        blocks: [
            {
                type: 'paragraph',
                data: {
                    text: input,
                },
            },
        ],
    };
}

/**
 * Counts the total number of characters in the text blocks of EditorJS OutputData.
 *
 * @param data - The OutputData object to count characters from.
 * @returns The total number of characters in the text blocks.
 */
export function getOutputDataLength(data: OutputData | string): number {
    if (typeof data === 'string') {
        data = toEditorData(data);
    }

    return data.blocks.reduce((acc, block) => acc + getOutputBlockLength(block), 0);
}

/**
 * Counts the total number of characters in an array of OutputBlockData.
 *
 * @param blocks - The array of OutputBlockData to count characters from.
 * @returns The total number of characters in the text blocks.
 */
export function getOutputBlocksLength(blocks: OutputBlockData[]): number {
    return blocks.reduce((acc, block) => acc + getOutputBlockLength(block), 0);
}

/**
 * Counts the number of characters in a single OutputBlockData if it is a text block.
 *
 * @param block - The OutputBlockData to count characters from.
 * @returns The number of characters in the text block, or 0 if not a text block.
 */
export function getOutputBlockLength(block: OutputBlockData): number {
    const div = document.createElement('div');
    div.innerHTML = block.data.text || '';
    const length = (div.textContent || div.innerText).length;
    return length;
}
