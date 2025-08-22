export type Image = {
    id?: number;
    url: string;
    index?: number | null;
};

export type CreateImageRequest = {
    imageUrl?: string | null;
    tempUrl?: string | null;
    file?: File | null;
    isPrimary: boolean;
    order: number;
};
