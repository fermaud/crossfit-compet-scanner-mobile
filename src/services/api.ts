import { EventFilters, FetchEventResponse } from '../types/Event';
import dayjs from 'dayjs';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

export const fetchEvents = async (filters: EventFilters): Promise<FetchEventResponse> => {
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (key === 'startDate' || key === 'endDate') {
        if (value instanceof Date) {
          queryParams.append(key, dayjs(value).format('YYYY-MM-DD'));
        }
      } else if (Array.isArray(value)) {
        value.forEach(item => queryParams.append(key, item.toString()));
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });
  console.log(`${BACKEND_URL}?${queryParams.toString()}`);

  const response = await fetch(`${BACKEND_URL}?${queryParams.toString()}`);
  console.log(response);
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  
  return response.json();
};