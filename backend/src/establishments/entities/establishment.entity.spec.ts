import { Establishment } from './establishment.entity';
import { Availability } from 'src/availabilities/entities/availability.entity';

describe('Establishment entity', () => {
  it('should create an Establishment and set all properties', () => {
    const est = new Establishment();

    est.id = 'est-uuid-1234';
    est.name = 'Test Establishment';
    est.description = 'Description test';
    est.address = '123 Main Street';
    est.phone = '0123456789';

    const avail1 = new Availability();
    avail1.id = 'avail-1';
    avail1.establishment = est;

    const avail2 = new Availability();
    avail2.id = 'avail-2';
    avail2.establishment = est;

    est.availabilities = [avail1, avail2];

    // Assertions
    expect(est.id).toBe('est-uuid-1234');
    expect(est.name).toBe('Test Establishment');
    expect(est.description).toBe('Description test');
    expect(est.address).toBe('123 Main Street');
    expect(est.phone).toBe('0123456789');
    expect(est.availabilities.length).toBe(2);
    expect(est.availabilities[0]).toBe(avail1);
    expect(est.availabilities[1]).toBe(avail2);
  });
});
