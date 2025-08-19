import { Availability } from './availability.entity';
import { Establishment } from '../../establishments/entities/establishment.entity';

describe('Availability entity', () => {
  it('should create an Availability and set all properties', () => {
    const avail = new Availability();

    avail.id = 'uuid-1234';

    const est = new Establishment();
    est.id = 'est-uuid';
    avail.establishment = est;
    avail.establishmentId = est.id;

    avail.date = '2025-08-19';
    avail.startTime = '09:00';
    avail.endTime = '12:00';
    avail.maxParticipants = 10;
    avail.details = 'Some details';
    avail.isActive = false;
    avail.isBooked = true;

    // Assertions pour s'assurer que tout est bien assigné
    expect(avail.id).toBe('uuid-1234');
    expect(avail.establishment).toBe(est);
    expect(avail.establishmentId).toBe('est-uuid');
    expect(avail.date).toBe('2025-08-19');
    expect(avail.startTime).toBe('09:00');
    expect(avail.endTime).toBe('12:00');
    expect(avail.maxParticipants).toBe(10);
    expect(avail.details).toBe('Some details');
    expect(avail.isActive).toBe(false);
    expect(avail.isBooked).toBe(true);
  });
});
