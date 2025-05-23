import { Competence } from '../models/competence';
import { OffreStatus } from './offre-status';
export interface JobOfferDtoGet {
    Id?: string | null;
  Competences?: Array<Competence> | null;
  Description?: string | null;
  Experience?: number;
  Location?: string | null;
  Salary?: number;
  Title?: string | null;
  PublishDate?: Date | null;
  Status:OffreStatus;
}
