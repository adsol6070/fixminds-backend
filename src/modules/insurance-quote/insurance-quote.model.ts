import mongoose, { Schema } from "mongoose";
import { IInsuranceQuote } from "../../common/types/lead.type";

export interface IInsuranceQuoteModel extends IInsuranceQuote, Document {}

const InsuranceQuoteSchema = new Schema<IInsuranceQuoteModel>(
  {
    vehicle: {
      vehicleInputMethod: {
        type: String,
        enum: ["manual", "vin"],
        required: true,
      },
      vin: { type: String },
      year: String,
      make: String,
      model: String,
      vehicleCondition: { type: String, enum: ["New", "Used"], required: true },
      ownerCheck: {
        type: String,
        enum: ["Owned", "Financed", "Leased"],
        required: true,
      },
      purchaseYear: String,
      purchaseMonth: String,
      annualDistance: String,
      commuteUsage: { type: String, enum: ["Yes", "No"] },
      commuteDistance: String,
      businessUse: { type: String, enum: ["Yes", "No"] },
    },

    coverageStart: { type: Date, required: true },

    groupDiscountOption: {type: String},
    groupDiscountInput: {type: String},

    personal: {
      firstName: String,
      lastName: String,
      preferredFirstName: String,
      preferredLastName: String,
      dob: {
        year: String,
        month: String,
        day: String,
      },
      gender: { type: String, enum: ["Male", "Female", "Other"] },
      maritalStatus: {
        type: String,
        enum: ["Single", "Married", "Divorced", "Widowed"],
      },
      address: String,
      city: String,
      pincode: String,
      province: String,
    },

    license: {
      hasOntarioLicense: { type: String, enum: ["Yes", "No"] },
      licenseClass: String,
      firstLicensedYear: String,
      licenseNumber: String,
    },

    history: {
      hadTickets: { type: String, enum: ["Yes", "No"] },
      tickets: [
        {
          reason: String,
          year: String,
          month: String,
        },
      ],
      hadSuspensions: { type: String, enum: ["Yes", "No"] },
      suspensions: [
        {
          length: String,
        },
      ],
      hadClaims: { type: String, enum: ["Yes", "No"] },
      hadInsurance: { type: String, enum: ["Yes", "No"] },
    },

    contact: {
      phone: String,
      email: String,
    },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'InsuranceQuote', default: null },
  },
  { timestamps: true }
);

export const InsuranceQuote = mongoose.model<IInsuranceQuoteModel>(
  "InsuranceQuote",
  InsuranceQuoteSchema
);
