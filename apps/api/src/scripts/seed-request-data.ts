import "dotenv/config";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import { DepartmentModel } from "../models/Department.js";
import { RequestTypeModel } from "../models/RequestType.js";

const departments = [
  {
    name: "International Students Office",
    code: "ISO",
    description:
      "Handles international student documentation, immigration, and student support.",
  },
  {
    name: "Admissions",
    code: "ADM",
    description: "Handles admissions and student admission-related services.",
  },
  {
    name: "Finance",
    code: "FIN",
    description: "Handles fees, payments, refunds, and financial matters.",
  },
  {
    name: "Accommodation",
    code: "ACC",
    description: "Handles hostel and student accommodation services.",
  },
  {
    name: "Registrar",
    code: "REG",
    description:
      "Handles academic records, certificates, transcripts, and registration.",
  },
];

const requestTypes = [
  {
    name: "Visa Extension",
    code: "VISA_EXTENSION",
    departmentCode: "ISO",
    description: "Request assistance with extending a student visa.",
  },
  {
    name: "Bonafide Certificate",
    code: "BONAFIDE",
    departmentCode: "REG",
    description: "Request an official bonafide student certificate.",
  },
  {
    name: "Transcript Request",
    code: "TRANSCRIPT",
    departmentCode: "REG",
    description: "Request an official academic transcript.",
  },
  {
    name: "Fee Issue",
    code: "FEE_ISSUE",
    departmentCode: "FIN",
    description: "Report or request assistance with a student fee issue.",
  },
  {
    name: "Hostel Request",
    code: "HOSTEL",
    departmentCode: "ACC",
    description: "Submit a student accommodation or hostel request.",
  },
  {
    name: "Admission Support",
    code: "ADMISSION_SUPPORT",
    departmentCode: "ADM",
    description: "Request assistance with an admissions-related matter.",
  },
];

const run = async (): Promise<void> => {
  await mongoose.connect(env.mongodbUrl);

  console.log("Connected to MongoDB");

  const departmentMap = new Map<string, string>();

  for (const departmentData of departments) {
    const department = await DepartmentModel.findOneAndUpdate(
      { code: departmentData.code },
      departmentData,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    departmentMap.set(department.code, department._id.toString());
  }

  for (const requestTypeData of requestTypes) {
    const departmentId = departmentMap.get(requestTypeData.departmentCode);

    if (!departmentId) {
      throw new Error(
        `Department not found: ${requestTypeData.departmentCode}`,
      );
    }

    await RequestTypeModel.findOneAndUpdate(
      { code: requestTypeData.code },
      {
        name: requestTypeData.name,
        code: requestTypeData.code,
        description: requestTypeData.description,
        department: departmentId,
        isActive: true,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );
  }

  console.log(`Seeded ${departments.length} departments.`);

  console.log(`Seeded ${requestTypes.length} request types.`);

  await mongoose.disconnect();

  console.log("Database connection closed.");
};

run().catch(async (error) => {
  console.error("Seed failed:", error);

  await mongoose.disconnect();

  process.exit(1);
});
