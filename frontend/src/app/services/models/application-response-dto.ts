import { CandidatDto } from "./candidat-dto";
import { CvFileDto } from "./cv-file-dto";
import { JobOfferDtoGet } from "./job-offer-dto-get";

export interface ApplicationResponseDto {
  ApplicationId: string;
  Candidate: CandidatDto;
  ApplicationDate: string;
  CvFile?: CvFileDto;
  Message?: string;
  Status?: string;
  JobOffer: JobOfferDtoGet;
  AdequacyScore: number;
}
