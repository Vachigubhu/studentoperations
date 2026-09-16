import { RequestTypeModel } from "../models/RequestType.js";
import "../models/Department.js";

export const getActiveRequestTypes = async () => {
  return RequestTypeModel.find({
    isActive: true,
  })
    .populate("department", "name code")
    .sort({ name: 1 });
};
