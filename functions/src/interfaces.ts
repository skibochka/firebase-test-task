import { EnvelopeStatus } from './enums';

export interface DownloadFileDto {
  envelope: string;
  document: string;
}

export interface Envelope {
  id: string;
  docs: string[];
  users: string[];
  status: EnvelopeStatus;
}
