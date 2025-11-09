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
    index: number;
};

export type ImageReorderBody = {
    imageId: number;
    index: number;
};
