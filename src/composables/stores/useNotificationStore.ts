import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
    const notifications = ref<string[]>([]);

    const addNotification = (notification: string) => {
        notifications.value.push(notification);
    };

    const removeNotification = (notification: string) => {
        const index = notifications.value.indexOf(notification);
        notifications.value.splice(index, 1);
    };

    return { notifications, addNotification, removeNotification };
});
