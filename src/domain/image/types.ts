export type Image = {
    id?: number;
    url: string;
    index?: number;
};

export type ImageRequest = {
    imageUrl?: string | null;
    tempUrl?: string | null;
    file?: File | null;
    isPrimary: boolean;
    index: number;
};
