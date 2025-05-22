import PDFDocument from "pdfkit";

export const generateQuotePdfBuffer = async (quote: any): Promise<Buffer> => {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const buffers: any[] = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });

    doc.fontSize(18).text("Insurance Quote", { align: "center" }).moveDown();

    doc.fontSize(12).text(`Name: ${quote.personal.firstName} ${quote.personal.lastName}`);
    doc.text(`Email: ${quote.contact?.email || "N/A"}`);
    doc.text(`Phone: ${quote.contact?.phone || "N/A"}`);
    doc.text(`Vehicle: ${quote.vehicle.year} ${quote.vehicle.make} ${quote.vehicle.model}`);
    doc.text(`Coverage Start: ${new Date(quote.coverageStart).toDateString()}`);

    if (quote.groupDiscountOption === "addGroup") {
      doc.text(`Group Discount: ${quote.groupDiscountInput}`);
    }

    doc.moveDown().text("Thank you for your submission!", { align: "center" });

    doc.end();
  });
};
