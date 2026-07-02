import { MovieCertificateEnum } from "../enums/base.enum";

export const MOVIE_CERTIFICATES = Object.keys(MovieCertificateEnum).filter(
  (key) => isNaN(Number(key)),
);
