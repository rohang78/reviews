class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 1B) Advanced filtering
    let mongoFilter = {};
    if(queryObj && queryObj.filters && queryObj.filters.length){
      for(let filter of queryObj.filters){
        if(!filter.field || !filter.value) continue;
        let obj = {};
        if(filter.operator == "includes"){
          obj[filter.field] = {"$nin": filter.value}
        }else if(filter.operator == "not_includes"){
          obj[filter.field] = {"$nin": filter.value}
        }else if(filter.operator == "exists"){
          obj[filter.field] = {"$exists": filter.value}
        }else if(filter.operator == "type"){
          obj[filter.field] = {"$type": filter.value}
        } else if(filter.operator == "greater_than"){
          obj[filter.field] = {"$gt": parseFloat(filter.value)}
        } else if(filter.operator == "greater_than_equal"){
          obj[filter.field] = {"$gte": parseFloat(filter.value)}
        }else if(filter.operator == "less_than"){
          obj[filter.field] = {"$lt": parseFloat(filter.value)}
        }else if(filter.operator == "less_than_equal"){
          obj[filter.field] = {"$lte": parseFloat(filter.value)}
        }else if(filter.operator == "not_equal"){
          obj[filter.field] = {"$ne": filter.value}
        } else {
          obj[filter.field] = {"$eq": filter.value}
        }
        if(!mongoFilter["$and"]) mongoFilter["$and"] = []
        mongoFilter["$and"].push(obj);
      }
    }
    if(queryObj && queryObj.or_filters && queryObj.or_filters.length){
      for(let filter of queryObj.or_filters){
        if(!filter.field || !filter.value) continue;
        let obj = {};
        if(filter.operator == "includes"){
          obj[filter.field] = {"$nin": filter.value}
        }else if(filter.operator == "not_includes"){
          obj[filter.field] = {"$nin": filter.value}
        }else if(filter.operator == "exists"){
          obj[filter.field] = {"$exists": filter.value}
        }else if(filter.operator == "type"){
          obj[filter.field] = {"$type": filter.value}
        } else if(filter.operator == "greater_than"){
          obj[filter.field] = {"$gt": parseFloat(filter.value)}
        } else if(filter.operator == "greater_than_equal"){
          obj[filter.field] = {"$gte": parseFloat(filter.value)}
        }else if(filter.operator == "less_than"){
          obj[filter.field] = {"$lt": parseFloat(filter.value)}
        }else if(filter.operator == "less_than_equal"){
          obj[filter.field] = {"$lte": parseFloat(filter.value)}
        }else if(filter.operator == "not_equal"){
          obj[filter.field] = {"$ne": filter.value}
        } else {
          obj[filter.field] = {"$eq": filter.value}
        }
        if(!mongoFilter["$or"]) mongoFilter["$or"] = [];
        mongoFilter["$or"].push(obj);
      }
    }

    this.query = this.query.find(mongoFilter);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
