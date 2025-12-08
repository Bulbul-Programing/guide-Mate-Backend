
type QueryParams = Record<string, unknown>;

class QueryBuilder<T> {
    public query: QueryParams;
    public prismaQuery: any;

    constructor(query: QueryParams) {
        this.query = query;
        this.prismaQuery = {
            where: {},
        };
    }

    searching(searchableFields: string[]) {
        const searchTerm = this.query.searchTerm as string;

        if (searchTerm) {
            this.prismaQuery.where = {
                ...this.prismaQuery.where,
                OR: searchableFields.map((field) => ({
                    [field]: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                })),
            };
        }
        return this;
    }

    category() {
        if (this.query.category) {
            this.prismaQuery.where = {
                ...this.prismaQuery.where,
                category: (this.query.category).toString().toUpperCase() as string,
            }
        }
        return this;
    }

    filter() {
        const queryObj = { ...this.query };

        const excludeFields = [
            'searchTerm',
            'sort',
            'limit',
            'page',
            'fields',
            'category',
            'minValue',
            'maxValue',
        ];

        excludeFields.forEach((el) => delete queryObj[el]);

        this.prismaQuery.where = {
            ...this.prismaQuery.where,
            ...queryObj,
        };

        return this;
    }

    sort() {
        const sort = this.query.sort as string;

        if (sort) {
            this.prismaQuery.orderBy = sort.split(',').map((field) => {
                if (field.startsWith('-')) {
                    return { [field.slice(1)]: 'desc' };
                }
                return { [field]: 'asc' };
            });
        } else {
            this.prismaQuery.orderBy = { createdAt: 'desc' };
        }

        return this;
    }
    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;

        this.prismaQuery.skip = (page - 1) * limit;
        this.prismaQuery.take = limit;

        return this;
    }
    fields() {
        if (this.query.fields) {
            this.prismaQuery.select = (this.query.fields as string)
                .split(',')
                .reduce((acc, field) => {
                    acc[field] = true;
                    return acc;
                }, {} as Record<string, boolean>);
        }
        return this;
    }


}
export default QueryBuilder;