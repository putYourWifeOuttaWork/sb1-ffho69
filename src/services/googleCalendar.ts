import { generateMockTimeSlots } from '../utils/mockData';
import type { TimeSlot } from '../utils/calendar';

const CLIENT_ID = '720919814468-8p7n778egbmlsc4c0pkf2r5u5ppi5qdh.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDiaWY6BVpsc_3mwj0k4X6a7x6S7VJVrOU';
const CALENDAR_ID = 'primary';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

// Use mock data until Google Calendar API is fully configured
const USE_MOCK_DATA = true;

class GoogleCalendarService {
  private static instance: GoogleCalendarService;
  private initialized: boolean = false;

  private constructor() {}

  public static getInstance(): GoogleCalendarService {
    if (!GoogleCalendarService.instance) {
      GoogleCalendarService.instance = new GoogleCalendarService();
    }
    return GoogleCalendarService.instance;
  }

  private async init(): Promise<boolean> {
    if (this.initialized || USE_MOCK_DATA) return true;

    try {
      await new Promise((resolve) => gapi.load('client:auth2', resolve));
      await gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
      });

      await gapi.client.load('calendar', 'v3');
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing GAPI client:', error);
      return false;
    }
  }

  async getAvailableSlots(date: string): Promise<TimeSlot[]> {
    if (USE_MOCK_DATA) {
      return generateMockTimeSlots(date);
    }

    try {
      const initialized = await this.init();
      if (!initialized) {
        throw new Error('Calendar service not initialized');
      }
      
      const startTime = new Date(date);
      startTime.setHours(0, 0, 0, 0);
      
      const endTime = new Date(date);
      endTime.setHours(23, 59, 59, 999);

      const response = await gapi.client.calendar.events.list({
        calendarId: CALENDAR_ID,
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.result.items || [];
      const bookedTimes = new Set(events.map(event => event.start?.dateTime));

      const timeSlots = [
        { start: '10:00 AM', end: '2:00 PM' },
        { start: '12:00 PM', end: '4:00 PM' },
        { start: '2:00 PM', end: '6:00 PM' },
        { start: '4:00 PM', end: '8:00 PM' },
        { start: '6:00 PM', end: '10:00 PM' },
        { start: '8:00 PM', end: '12:00 AM' }
      ];

      return timeSlots.map((slot, index) => {
        const slotStart = new Date(date);
        const [time, period] = slot.start.split(' ');
        const [hours, minutes] = time.split(':');
        let hour = parseInt(hours);
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        
        slotStart.setHours(hour, parseInt(minutes), 0, 0);

        return {
          id: `slot-${index}`,
          startTime: slot.start,
          endTime: slot.end,
          available: !bookedTimes.has(slotStart.toISOString())
        };
      });
    } catch (error) {
      console.error('Error fetching available slots:', error);
      return generateMockTimeSlots(date);
    }
  }

  async checkAvailability(date: string): Promise<boolean> {
    try {
      const slots = await this.getAvailableSlots(date);
      return slots.some(slot => slot.available);
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  }

  async reserveSlot(date: string, slotId: string): Promise<boolean> {
    if (USE_MOCK_DATA) {
      return true;
    }

    try {
      const slots = await this.getAvailableSlots(date);
      const slot = slots.find(s => s.id === slotId);
      
      if (!slot || !slot.available) {
        throw new Error('Time slot is not available');
      }

      // In a real implementation, we would create a calendar event here
      return true;
    } catch (error) {
      console.error('Error reserving slot:', error);
      throw error;
    }
  }
}

export const calendarService = GoogleCalendarService.getInstance();