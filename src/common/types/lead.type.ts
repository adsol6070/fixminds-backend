import { Types } from "mongoose";

interface IVehicleDetails {
  vehicleInputMethod: "manual" | "vin";
  vin: string;
  year: string;
  make: string;
  model: string;
  vehicleCondition: "New" | "Used";
  ownerCheck: "Owned" | "Financed" | "Leased";
  purchaseYear: string;
  purchaseMonth: string;
  annualDistance: string;
  commuteUsage: "Yes" | "No";
  commuteDistance?: string;
  businessUse: "Yes" | "No";
}

interface ITicket {
  reason: string;
  year: string;
  month: string;
}

interface ISuspension {
  length: string;
}

interface IPersonalDetails {
  firstName: string;
  lastName: string;
  preferredFirstName?: string;
  preferredLastName?: string;
  dob: {
    year: string;
    month: string;
    day: string;
  };
  gender: "Male" | "Female" | "Other";
  maritalStatus: "Single" | "Married" | "Divorced" | "Widowed";
  address: string;
  city: string;
  pincode: string;
  province: string;
}

interface ILicenseDetails {
  hasOntarioLicense: "Yes" | "No";
  licenseClass: string;
  firstLicensedYear: string;
  licenseNumber: string;
}

interface IInsuranceHistory {
  hadTickets: "Yes" | "No";
  tickets?: ITicket[];
  hadSuspensions: "Yes" | "No";
  suspensions?: ISuspension[];
  hadClaims: "Yes" | "No";
  hadInsurance: "Yes" | "No";
}

interface IContactInfo {
  phone: string;
  email: string;
}

export interface IInsuranceQuote {
  vehicle: IVehicleDetails;
  coverageStart: Date;
  groupDiscountOption: string;
  groupDiscountInput: string,
  personal: IPersonalDetails;
  license: ILicenseDetails;
  history: IInsuranceHistory;
  contact: IContactInfo;
  referredBy?: Types.ObjectId | null;
}
