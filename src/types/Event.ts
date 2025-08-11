export type EventType = 'online' | 'onSite' | 'ALL';
export type EventDuration = '1' | '2' | '3' | 'ALL';
export type Source = 'scoringFit' | 'competitionCorner' | 'ALL';

export type EventFilters = {
  type?: EventType;
  name?: string;
  duration?: EventDuration;
  source?: Source;
  startDate?: Date;
  endDate?: Date;
  page: number;
  size: number;
  selectedDepartements?: Array<string>;
};

export type EventItem = {
  _id: number;
  name: string;
  incompleteAddress: boolean;
  type: Exclude<EventType, 'ALL'>;
  startDate: string;
  endDate: string;
  location: string;
  eventLink: string;
  departement: string;
  zipCode: string;
  createdAt: string;
  updatedAt: string;
  source: Exclude<Source, 'ALL'>;
  duration: Exclude<EventDuration, 'ALL'>;
};

export interface FetchEventResponse {
  results: EventItem[];
  count: number;
}