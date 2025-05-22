export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType: string,
}

export interface EmailPayload {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
  attachments?: EmailAttachment[];
}
