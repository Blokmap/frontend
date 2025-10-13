export type Image = {
    id: number;
    url: string;
    index: number;
};

export type ImageRequest = {
    id?: number;
    imageUrl?: string | null;
    tempUrl?: string | null;
    file?: File | null;
    isPrimary: boolean;
    index: number;
};

export type ImageReorderRequest = {
    imageId: number;
    index: number;
};
