export type Image = {
    id: number;
    url: string;
    index: number;
};

export type ImageBody = {
    id?: number;
    imageUrl?: string | null;
    tempUrl?: string | null;
    file?: File | null;
    isPrimary: boolean;
    index: number;
};

export type ImageReorderBody = {
    imageId: number;
    index: number;
};
