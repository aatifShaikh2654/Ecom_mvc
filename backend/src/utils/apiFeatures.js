/**
 * Build dynamic Prisma query filter based on params
 * @param {Object} params - The query params from the request
 * @param {string[]} searchableFields - Fields to apply search on
 * @param {Object} filterableFields - Fields with exact filters { fieldName: 'string' }
 * @returns {Object} Prisma query object { where, orderBy, skip, take }
 */

function apiFeature(params, searchableFields = [], filterableFields = [], type = null) {
    console.log(params?.limit)
    let { search, page = 1, limit = 20, sortBy = 'createdAt', sort = 'desc', filters = {} } = params;

    page = parseInt(page)
    limit = parseInt(limit)

    // Build where clause
    let searchQuery = undefined;

    if (search && searchableFields.length > 0) {
        searchQuery = {
            OR: searchableFields.map((fieldPath) => {
                const parts = fieldPath.split(".");
                const [root, sub] = parts;

                // Flat field: e.g., "email"
                if (!sub) {
                    return {
                        [root]: {
                            contains: search,
                        },
                    };
                }

                // Relation field: e.g., "user.name"
                return {
                    [root]: {
                        is: {
                            [sub]: {
                                contains: search,
                            },
                        },
                    },
                };
            }),
        };
    }

    // Build filters query (AND, exact match)
    const filtersQuery = {};

    const filter = Object.keys(filters).length > 0 ? JSON.parse(filters) : {}
    filterableFields.map(field => {
        if (filter[field] !== undefined && filter[field] !== '') {
            if (field === "dateFrom" || field === "dateTo") {
                filtersQuery[sortBy] = {};

                if (filter.dateFrom) {
                    const startOfDate = new Date(new Date(filter.dateFrom).setHours(0, 0, 0, 0));
                    filtersQuery[sortBy].gte = startOfDate;
                }

                if (filter.dateTo) {
                    const endOfDay = new Date(new Date(filter.dateTo).setHours(23, 59, 59, 999));
                    filtersQuery[sortBy].lte = endOfDay;
                }
            } else {
                filtersQuery[field] = filter[field];
            }
        }
    });

    // Build orderBy
    const orderBy = {
        [sortBy]: sort,
    };

    // Pagination
    const skip = (page - 1) * limit;
    const take = limit;

    // Combined where
    const where = {
        ...(searchQuery || {}),
        ...(Object.keys(filtersQuery).length > 0 ? filtersQuery : {}),
    };

    return {
        params: {
            page,
            limit,
        },
        search: searchQuery,
        filters: filtersQuery,
        where,
        orderBy,
        skip,
        take,
    };
}

module.exports = { apiFeature };
