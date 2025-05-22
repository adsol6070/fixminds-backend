import { mailTransporter } from "../../config/mail.config";
import { compileTemplate } from "../utils/compile-template";
import { EmailPayload } from "../types/email.type";

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: EmailPayload): Promise<void> => {
  let finalHtml;

  if (templateName && templateData) {
    finalHtml = compileTemplate(templateName, templateData);
  }

  const transformedAttachments = attachments?.map((att) => ({
    filename: att.filename,
    content:
      typeof att.content === "string"
        ? Buffer.from(att.content, "base64")
        : att.content,
    contentType: att.contentType,
  }));

  const mailOptions: any = {
    from: `"FixMinds Insurance INC" <no-reply@yourapp.com>`,
    to,
    subject,
    html: finalHtml,
    ...(transformedAttachments?.length && {
      attachments: transformedAttachments,
    }),
  };

  await mailTransporter.sendMail(mailOptions);

  console.info(`Email sent: ${subject} -> ${to}`);
};
