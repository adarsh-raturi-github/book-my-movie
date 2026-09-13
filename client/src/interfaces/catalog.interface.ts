export interface Movie {
  id: string;
  title: string;
  certificate: string;
  duration: string;
}

export interface Theater {
  id: string;
  name: string;
  description?: string;
  phoneNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  city: string;
  state?: string;
  country?: string;
  postalCode?: string;
  timezone?: string;
  screens: number;
}

export interface Show {
  id: string;
  movie: string;
  theater: string;
  screen: string;
  date: string;
  time: string;
}
