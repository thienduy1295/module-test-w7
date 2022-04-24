const express = require("express");
const router = express.Router();
const fs = require("fs");
const {
  sendResponse,
  throwException,
  generateRandomHexString,
} = require("../helpers/util");
const isAuthenticated = require("../middlewares/isAuthenticated");
const queryValidation = require("../middlewares/queryValidation");

const loadData = () => {
  let db = fs.readFileSync("data.json", "utf8");
  return JSON.parse(db);
};

/* GET Companies */
router.get("/", queryValidation, function (req, res, next) {
  let message = "Company list";
  let db = loadData();
  let { companies, jobs } = db;

  const limit = req.query.limit || 20;
  const page = req.query.page || 1;
  const offset = limit * (page - 1);
  companies = companies.slice(offset, limit * page);

  let { city } = req.query;
  if (city) {
    // let cities = city.split(",");
    // cities = cities.forEach((cityEl) =>
    //   jobs.filter((job) => job.city === cityEl).map((job) => job.companyId)
    // );
    jobs = jobs.filter((job) => job.city === city).map((job) => job.companyId);
    companies = companies.filter((company) => jobs.includes(company.id));
  }
  return sendResponse(
    200,
    {
      companies,
      currentPage: parseInt(page),
      totalCompany: db.companies.length,
    },
    message,
    res,
    next
  );
});
router.get("/:id", function (req, res, next) {
  const { id } = req.params;
  try {
    const db = loadData();
    let { companies } = db;
    const found = companies.find((company) => company.id === id);
    if (!found) {
      throwException("Company is not found", 400);
    }
    return sendResponse(200, found, "Get single company by id", res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/", isAuthenticated, function (req, res, next) {
  try {
    const { name, benefits, description, jobs, ratings } = req.body;
    if (!name || !benefits || !description || !jobs) {
      throwException("Missing info", 400);
    }
    let dataToSave = loadData();
    let { companies } = dataToSave;
    const found = companies.find((e) => e.name === name);
    if (found) {
      throwException("Name is already existed", 400);
    }

    const companyObj = {
      id: `_${generateRandomHexString(9)}`,
      name,
      benefits,
      description,
      ratings,
      jobs,
      numOfJobs: jobs.length,
      numOfRatings: ratings.length,
    };

    companies.push(companyObj);
    dataToSave = JSON.stringify(dataToSave);
    fs.writeFileSync("data.json", dataToSave);
    return sendResponse(200, companyObj, "Create company success", res, next);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", isAuthenticated, function (req, res, next) {
  try {
    const { id } = req.params;
    let db = loadData();
    const { companies } = db;
    const found = companies.find((el) => el.id === id);
    if (!found) {
      throwException("Company is not found", 400);
    }
    let dataTosave = companies.map((e) => {
      if (e.id === id) {
        e["enterprise"] = true;
      }
      return e;
    });
    companies.push(dataTosave);

    db = JSON.stringify(db);
    fs.writeFileSync("data.json", db);
    return sendResponse(200, {}, "Update success", res, next);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", isAuthenticated, function (req, res, next) {
  try {
    const { id } = req.params;
    let db = loadData();
    const found = db.find((el) => el.id === id);
    if (!found) {
      throwException("Company is not found", 400);
    }
    db = db.filter((e) => e.id !== id);
    db = JSON.stringify(db);
    fs.writeFileSync("data.json", db);
    return sendResponse(200, {}, "delete success", res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
