import type { RouteLocationRaw } from 'vue-router';

export type Breadcrumb = {
    label: string;
    to: RouteLocationRaw;
};

export type Breadcrumbs = Breadcrumb[];
