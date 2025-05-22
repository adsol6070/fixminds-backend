import { mailTransporter } from "../../config/mail.config";
import { compileTemplate } from "../utils/compile-template";
import { EmailPayload } from "../types/email.type";

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
}: EmailPayload): Promise<void> => {
  let finalHtml;

  if (templateName && templateData) {
    finalHtml = compileTemplate(templateName, templateData);
  }

  await mailTransporter.sendMail({
    from: `"FixMinds Insurance INC" <no-reply@yourapp.com>`,
    to,
    subject,
    html: finalHtml,
  });

  console.info(`Email sent: ${subject} -> ${to}`);
};
