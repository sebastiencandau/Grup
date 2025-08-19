import { Reservation } from './reservation.entity';
import { Availability } from '../../availabilities/entities/availability.entity';

describe('Reservation Entity', () => {
  let reservation: Reservation;
  let availability: Availability;

  beforeEach(() => {
    availability = new Availability();
    availability.id = 'availability-uuid';
    availability.date = '2025-08-19';
    availability.startTime = '10:00';
    availability.endTime = '12:00';
    availability.maxParticipants = 5;

    reservation = new Reservation();
    reservation.id = 'reservation-uuid';
    reservation.title = 'Test Reservation';
    reservation.description = 'This is a test reservation';
    reservation.organizerEmail = 'test@example.com';
    reservation.token = 'securetoken';
    reservation.availability = availability;
    reservation.availabilityId = availability.id;
    reservation.participantsCount = 3;
    reservation.participants = ['alice@example.com', 'bob@example.com'];
  });

  it('should create a reservation instance with all fields', () => {
    expect(reservation).toBeDefined();
    expect(reservation.id).toBe('reservation-uuid');
    expect(reservation.title).toBe('Test Reservation');
    expect(reservation.description).toBe('This is a test reservation');
    expect(reservation.organizerEmail).toBe('test@example.com');
    expect(reservation.token).toBe('securetoken');
    expect(reservation.availability).toBe(availability);
    expect(reservation.availabilityId).toBe(availability.id);
    expect(reservation.participantsCount).toBe(3);
    expect(reservation.participants).toEqual(['alice@example.com', 'bob@example.com']);
  });

  it('should allow optional fields to be undefined', () => {
    const r = new Reservation();
    r.title = 'Minimal Reservation';
    r.organizerEmail = 'minimal@example.com';
    r.token = 'token123';
    r.availabilityId = 'availability-uuid';

    expect(r.description).toBeUndefined();
    expect(r.participants).toBeUndefined();

    // simuler la valeur par défaut côté TypeORM
    r.participantsCount = r.participantsCount ?? 1;
    expect(r.participantsCount).toBe(1);
  });
});
