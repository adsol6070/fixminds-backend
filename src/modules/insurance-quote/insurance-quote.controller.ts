import { Request, Response } from "express";
import { asyncHandler } from "../../common/utils/async-handler";
import { InsuranceQuoteService } from "./insurance-quote.service";
import { ApiError } from "../../common/utils/api-error";
import mongoose from "mongoose";
import { publishEmail } from "../../messaging/producers/email.producer";
import { generateQuotePdfBuffer } from "../../common/utils/generateQuotePdf";

const getAllQuotes = async (_req: Request, res: Response) => {
  const quotes = await InsuranceQuoteService.findManyQuotes({}, {}, { sort: { createdAt: -1 } });

  res.status(200).json({
    status: "success",
    results: quotes.length,
    data: quotes,
  });
};

const getQuoteById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const quote = await InsuranceQuoteService.findUniqueQuote({
    _id: new mongoose.Types.ObjectId(id),
  });

  if (!quote) throw new ApiError(404, "Insurance Quote not found");

  res.status(200).json({
    status: "success",
    data: quote,
  });
};

const createQuote = async (req: Request, res: Response) => {
  console.log("requestedBody ", req.body);
  const { referredBy, ...quoteData } = req.body;

  const createdQuote = await InsuranceQuoteService.createQuote({
    ...quoteData,
    referredBy: referredBy || null
  });

 const referralLink = `${process.env.FORM_URL}/index.html?ref=${createdQuote._id}`;

  const pdfBuffer = await generateQuotePdfBuffer(req.body);
  const base64PDF = pdfBuffer.toString("base64");

 await publishEmail("email.quote", {
    to: "goyaljatin208@gmail.com", 
    subject: `${createdQuote.personal.firstName}_${createdQuote.personal.lastName}_${createdQuote.personal.dob.year}_${createdQuote.personal.dob.month}_${createdQuote.personal.dob.year}`,
    templateName: "new-quote-notification",
    templateData: {
      name: `${createdQuote.personal.firstName} ${createdQuote.personal.lastName}`,
      quoteId: createdQuote._id,
    },
    attachments: [
      {
        filename: `${createdQuote.personal.firstName}_${createdQuote.personal.lastName}_${createdQuote.personal.dob.year}_${createdQuote.personal.dob.month}_${createdQuote.personal.dob.year}.pdf`,
        content: base64PDF,
        contentType: 'application/pdf',
      },
    ],
  });

  await publishEmail("email.quoteUser", {
    to: createdQuote.contact.email,
    subject: `Thank you, ${createdQuote.personal.firstName} ${createdQuote.personal.lastName}!`,
    templateName: "quote-submission-thankyou",
    templateData: {
      name: `${createdQuote.personal.firstName} ${createdQuote.personal.lastName}`,
      referralLink,
    },
  });


  res.status(201).json({
    status: "success",
    message: "Insurance Quote created successfully",
    data: {
      ...createdQuote.toObject(),
      referralLink
    },
  });
};

const updateQuoteById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const updatedQuote = await InsuranceQuoteService.updateQuote(
    { _id: new mongoose.Types.ObjectId(id) },
    req.body
  );

  if (!updatedQuote)
    throw new ApiError(404, "Insurance Quote not found or not updated");

  res.status(200).json({
    status: "success",
    message: "Insurance Quote updated successfully",
    data: updatedQuote,
  });
};

const deleteQuoteById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deleted = await InsuranceQuoteService.deleteQuote({
    _id: new mongoose.Types.ObjectId(id),
  });

  if (!deleted)
    throw new ApiError(404, "Insurance Quote not found or already deleted");

  res.status(200).json({
    status: "success",
    message: "Insurance Quote deleted successfully",
  });
};

const InsuranceQuoteController = {
  getAllQuotes: asyncHandler(getAllQuotes),
  getQuoteById: asyncHandler(getQuoteById),
  createQuote: asyncHandler(createQuote),
  updateQuoteById: asyncHandler(updateQuoteById),
  deleteQuoteById: asyncHandler(deleteQuoteById),
};

export default InsuranceQuoteController;
