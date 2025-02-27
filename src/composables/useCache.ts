import { useLocalStorage } from '@vueuse/core';
import { unref } from 'vue';

export function useCache<K, V>(persist: boolean = false, key: string = '') {
    const map = new Map<K, V>();
    const cache = persist ? unref(useLocalStorage(key, map)) : map;
    return { cache };
}
