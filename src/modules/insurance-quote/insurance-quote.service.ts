import { FilterQuery } from "mongoose";
import { IInsuranceQuoteModel, InsuranceQuote } from "./insurance-quote.model";
import { IInsuranceQuote } from "../../common/types/lead.type";

export const InsuranceQuoteService = {
  createQuote: async (input: Partial<IInsuranceQuote>) => {
    const quote = new InsuranceQuote(input);
    return await quote.save();
  },

  findUniqueQuote: async (
    query: FilterQuery<IInsuranceQuoteModel>,
    select: any = {}
  ): Promise<IInsuranceQuoteModel | null> => {
    return await InsuranceQuote.findOne(query).select(select).exec();
  },

  findManyQuotes: async (
    query: FilterQuery<IInsuranceQuoteModel>,
    select: any = {},
    options: { sort?: any } = {}
  ): Promise<IInsuranceQuoteModel[]> => {
    return await InsuranceQuote.find(query).select(select).sort(options.sort || {}).exec();
  },

  updateQuote: async (
    query: FilterQuery<IInsuranceQuoteModel>,
    data: Partial<IInsuranceQuote>,
    select: any = {}
  ): Promise<IInsuranceQuoteModel | null> => {
    return await InsuranceQuote.findOneAndUpdate(query, data, {
      new: true,
    })
      .select(select)
      .exec();
  },

  deleteQuote: async (
    query: FilterQuery<IInsuranceQuoteModel>
  ): Promise<IInsuranceQuoteModel | null> => {
    return await InsuranceQuote.findOneAndDelete(query).exec();
  },
};
