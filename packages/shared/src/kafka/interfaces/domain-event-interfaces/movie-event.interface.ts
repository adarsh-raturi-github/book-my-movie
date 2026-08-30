import { MovieCertificateEnum, MovieStatusEnum } from "../../enums";

export interface IMovieCreatedEventData {
  id: string;
  title: string;
  durationMinutes: number;
  language: string[];
  certificate: MovieCertificateEnum;
  genres: string[];
  posterUrl: string;
  status: MovieStatusEnum;
  entityVersion: number;
}

export interface IMovieUpdateEventData {
  id: string;
  title: string;
  durationMinutes: number;
  language: string[];
  certificate: MovieCertificateEnum;
  genres: string[];
  posterUrl: string;
  status: MovieStatusEnum;
  entityVersion: number;
}

export interface IMovieDeleteEventData {
  id: string;
  entityVersion: number;
}
