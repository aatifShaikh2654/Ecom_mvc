export const updateQueryParams = (removeKeys = []) => {
    const params = new URLSearchParams(window.location.search);
    removeKeys.forEach(key => params.delete(key));
    return `?${params.toString()}`;
};

export const pushQueryParams = (newParams = {}, router) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(newParams).forEach(([key, value]) => {
        params.set(key, value);
    });
    router.push(`?${params.toString()}`);
};
