export type Paginated<T> = {
    page: number;
    perPage: number;
    total: number;
    data: T[];
};
