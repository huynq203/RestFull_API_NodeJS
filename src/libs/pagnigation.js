const pagnigation = async (model, query, page, limit) => {
    const totalDocument = await model.find(query).countDocuments();
    const totalPages = Math.ceil(totalDocument / limit);
    const next = page + 1;
    const pre = page - 1;
    const hasNext = page < totalPages ? true : false;
    const hasPre = page > 1 ? true : false;
    return {
        totalDocument,
        totalPages,
        next,
        pre,
        hasNext,
        hasPre
    }
}

module.exports = pagnigation