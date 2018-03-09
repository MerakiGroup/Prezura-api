const commondbService = {};

commondbService.add = (model, data) => model.create(data);

commondbService.getAll = model => model.find({});
commondbService.query = (model, queryObj) => {
  const { condition, fields, options, limit, sort, limitStart } = queryObj;
  console.log(queryObj);
  if (limit > 0) {
    return model
      .find(condition, fields, options)
      .sort(sort)
      .skip(limitStart)
      .limit(limit);
  }

  return model.find(condition, fields, options).sort(sort);
};
export default commondbService;
