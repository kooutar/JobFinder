export interface Job {
  id: number;
  name: string;
  contents: string; 
  isFavorite: boolean;
  publication_date: string;
  locations: { name: string }[];
  company: {
    id: number;
    name: string;
    short_name: string;
  };
  refs: {
    landing_page: string;
  };
}
