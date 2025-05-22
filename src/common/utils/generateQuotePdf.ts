import PDFDocument from "pdfkit";

export const generateQuotePdfBuffer = async (quote: any): Promise<Buffer> => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: any[] = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });

    // Title
    doc.fontSize(20).fillColor("#333").text("Car Insurance Quote Summary", { align: "center" }).moveDown(1.5);

    // Section Helper
    const sectionTitle = (title: string) => {
      doc.fontSize(14).fillColor("#005A9C").text(title, { underline: true }).moveDown(0.5);
      doc.fillColor("black");
    };

    // Personal Information
    sectionTitle("Personal Information");
    const { personal } = quote;
    doc.fontSize(12)
      .text(`Full Name: ${personal.firstName} ${personal.lastName}`)
      .text(`Preferred Name: ${personal.preferredFirstName || "N/A"} ${personal.preferredLastName || "N/A"}`)
      .text(`Date of Birth: ${personal.dob.day}-${personal.dob.month}-${personal.dob.year}`)
      .text(`Gender: ${personal.gender}`)
      .text(`Marital Status: ${personal.maritalStatus}`)
      .text(`Address: ${personal.address}`)
      .text(`City: ${personal.city}`)
      .moveDown();

    // Contact Info (optional if exists)
    if (quote.contact) {
      sectionTitle("Contact Information");
      doc.text(`Email: ${quote.contact.email}`)
        .text(`Phone: ${quote.contact.phone}`)
        .moveDown();
    }

    // Vehicle Information
    sectionTitle("Vehicle Information");
    const { vehicle } = quote;
    doc.text(`Input Method: ${vehicle.vehicleInputMethod}`)
      .text(`VIN: ${vehicle.vin || "N/A"}`)
      .text(`Year: ${vehicle.year}`)
      .text(`Make: ${vehicle.make}`)
      .text(`Model: ${vehicle.model}`)
      .text(`Condition: ${vehicle.vehicleCondition}`)
      .text(`Ownership: ${vehicle.ownerCheck}`)
      .text(`Purchase Date: ${vehicle.purchaseMonth} ${vehicle.purchaseYear}`)
      .text(`Annual Distance: ${vehicle.annualDistance}`)
      .text(`Commute Usage: ${vehicle.commuteUsage}`)
      .text(`Commute Distance: ${vehicle.commuteDistance}`)
      .text(`Business Use: ${vehicle.businessUse}`)
      .moveDown();

    // Coverage Details
    sectionTitle("Coverage Details");
    doc.text(`Coverage Start Date: ${new Date(quote.coverageStart).toDateString()}`).moveDown();

    // Group Discount
    sectionTitle("Group Discount");
    doc.text(`Option: ${quote.groupDiscountOption}`);
    if (quote.groupDiscountOption === "addGroup") {
      doc.text(`Group Info: ${quote.groupDiscountInput}`);
    }

    doc.end();
  });
};
