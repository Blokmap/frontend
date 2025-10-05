export type Paginated<T> = {
    page: number;
    perPage: number;
    total: number;
    truncated: boolean;
    data: T[];
};

export type Pagination = {
    query?: string | null;
    perPage?: number;
    page?: number;
};
