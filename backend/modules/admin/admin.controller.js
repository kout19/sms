const adminService = require("./admin.service");

exports.getOverview = async (req, res, next) => {
  try {
    const overview = await adminService.getOverview(req.tenant.schoolId);
    res.json({ data: overview });
  } catch (error) {
    next(error);
  }
};
