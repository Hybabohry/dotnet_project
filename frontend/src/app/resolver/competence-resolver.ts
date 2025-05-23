import { ResolveFn } from "@angular/router";
import { Competence, CompetenceDto } from "../services/models";
import { CompetenceService } from "../services/services";
import { inject } from "@angular/core";

export const competenceResolver: ResolveFn<CompetenceDto[]> = (route, state) => {
  return inject(CompetenceService).apiCompetenceCompetencesGet();
};
