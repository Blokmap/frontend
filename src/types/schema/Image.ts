export type Image = {
    id?: number;
    url: string;
};

export type CreateImageRequest = {
    imageUrl?: string | null;
    tempUrl?: string | null;
    file?: File | null;
    isPrimary: boolean;
    order: number;
};
