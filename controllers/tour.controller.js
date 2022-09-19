const {
  getToursService,
  createTourService,
  getTourByIdService,
  updateTourByIdService,
 getCheapestToursService,
 getTrendingToursService
} = require("../services/tour.services");

exports.getTours = async (req, res, next) => {
  try {
    //Filters Starts

    //{price:{$ gt:50}
    //{ price: { gt: '50' } }
    // console.log(req.query);

    let filters = { ...req.query };

    //sort , page , limit -> excluding the query fields from filters
    const excludeFields = ["sort", "page", "limit"];
    excludeFields.forEach((field) => delete filters[field]);

    //gt ,lt ,gte .lte, eq, neq
    let filtersString = JSON.stringify(filters);
    filtersString = filtersString.replace(
      /\b(gt|gte|lt|lte|eq|neq)\b/g,
      (match) => `$${match}`
    );

    filters = JSON.parse(filtersString);

    //Filters Ends

    //Query Starts

    const queries = {};

    //sort query
    if (req.query.sort) {
      // price,qunatity   -> 'price quantity'
      const sortBy = req.query.sort.split(",").join(" ");
      queries.sortBy = sortBy;
      // console.log(sortBy);
    }

    //fields query
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      queries.fields = fields;
      // console.log(fields);
    }

    //page query
    if (req.query.page) {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * parseInt(limit);
      queries.skip = skip;
      queries.limit = parseInt(limit);
    }

    if(!req.query.limit){
      queries.limit = 10;
    }
    if(!req.query.page){
      queries.page = 1;
    }

    //Query Ends

    const tours = await getToursService(filters, queries);

    res.status(200).json({
      status: "success",
      data: tours,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "can't get the data",
      error: error.message,
    });
  }
};

exports.createTour = async (req, res, next) => {
  try {
    // save or create
    const result = await createTourService(req.body);
    res.status(200).json({
      status: "success",
      message: "Data inserted successfully!",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: " Data is not inserted ",
      error: error.message,
    });
  }
};

exports.getTourById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tour = await getTourByIdService(id);

    res.status(200).json({
      status: "success",
      data: tour,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "can't get the data",
      error: error.message,
    });
  }
};

exports.updateTourById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tour = await updateTourByIdService(id, req.body);

    res.status(200).json({
      stauts: "success",
      message: "Successfully updated the product",
      result: tour,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Couldn't update the product",
      error: error.message,
    });
  }
};

exports.getTrendingTours = async (req, res, next) => {
  try {
    const tours = await getTrendingToursService();

    res.status(200).json({
      status: "success",
      data: tours,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "can't get the data",
      error: error.message,
    });
  }
};

exports.getCheapestTours = async (req, res, next) => {
  try {
    const tours = await getCheapestToursService();

    res.status(200).json({
      status: "success",
      data: tours,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "can't get the data",
      error: error.message,
    });
  }
};
