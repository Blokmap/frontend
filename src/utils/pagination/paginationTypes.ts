export type Paginated<T> = {
    page: number;
    perPage: number;
    total: number;
    truncated: boolean;
    data: T[];
};

export type Pagination = {
    perPage?: number;
    page?: number;
};
