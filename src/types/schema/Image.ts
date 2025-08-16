export type Image = {
    id?: number;
    url: string;
};

export type CreateImageRequest = {
    url: string;
    isPrimary?: boolean;
    order?: number;
};
