import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthenticationStore = defineStore('authentication', () => {
    const user = ref();

    return { user };
});
