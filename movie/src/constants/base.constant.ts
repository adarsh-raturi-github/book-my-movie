import { MovieCertificateEnum } from "@adarsh-tickets/shared";

export const MOVIE_CERTIFICATES = Object.keys(MovieCertificateEnum).filter(
  (key) => isNaN(Number(key)),
);
