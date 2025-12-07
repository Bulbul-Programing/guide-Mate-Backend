
export type IOptions = {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

type IOptionResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export const paginateCalculation = (options: IOptions): IOptionResult => {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy;
    const sortOrder = options.sortOrder;
    return { page, limit, skip, sortBy, sortOrder };
}