export interface GetListCategoryEventResponse {
    message:    string;
    data:       Category[];
    pagination: Pagination;
}

export interface Category {
    id:   string;
    name: string;
}

export interface Pagination {
    total:      number;
    total_page: number;
    page:       number;
}