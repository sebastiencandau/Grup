import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilitiesController } from './availabilities.controller';
import { AvailabilitiesService } from './availabilities.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { Availability } from './entities/availability.entity';

// ✅ Helper global pour créer un mock d'Availability
const mockAvailability = (overrides?: Partial<Availability>): Availability => ({
    id: 'uuid-1',
    establishmentId: 'uuid-est',
    establishment: {} as any,
    date: '2025-08-20',
    startTime: '08:00',
    endTime: '10:00',
    maxParticipants: 1,
    details: undefined,
    isActive: true,
    isBooked: false,
    ...overrides,
});

describe('AvailabilitiesController', () => {
    let controller: AvailabilitiesController;
    let service: jest.Mocked<AvailabilitiesService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AvailabilitiesController],
            providers: [
                {
                    provide: AvailabilitiesService,
                    useValue: {
                        create: jest.fn(),
                        findAllByEstablishment: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<AvailabilitiesController>(AvailabilitiesController);
        service = module.get(AvailabilitiesService) as jest.Mocked<AvailabilitiesService>;
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should call service.create and return result', async () => {
            const dto: CreateAvailabilityDto = {
                startTime: '08:00', endTime: '10:00', date: '2025-08-20', establishmentId: 'uuid-est', maxParticipants: 1, // ✅ ajouté
            };
            const result = mockAvailability({ ...dto });

            service.create.mockResolvedValue(result);
            expect(await controller.create(dto)).toEqual(result);
            expect(service.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findAllByEstablishment', () => {
        it('should call service.findAllByEstablishment and return result', async () => {
            const establishmentId = 'uuid-est';
            const availabilities = [mockAvailability()];

            service.findAllByEstablishment.mockResolvedValue(availabilities);
            expect(await controller.findAllByEstablishment(establishmentId)).toEqual(availabilities);
            expect(service.findAllByEstablishment).toHaveBeenCalledWith(establishmentId);
        });
    });

    describe('findOne', () => {
        it('should call service.findOne and return result', async () => {
            const id = 'uuid-1';
            const availability = mockAvailability({ id });

            service.findOne.mockResolvedValue(availability);
            expect(await controller.findOne(id)).toEqual(availability);
            expect(service.findOne).toHaveBeenCalledWith(id);
        });
    });

    describe('update', () => {
        it('should call service.update and return result', async () => {
            const id = 'uuid-1';
            const dto: UpdateAvailabilityDto = { startTime: '09:00', endTime: '11:00' };
            const updated = mockAvailability({ id, ...dto });

            service.update.mockResolvedValue(updated);
            expect(await controller.update(id, dto)).toEqual(updated);
            expect(service.update).toHaveBeenCalledWith(id, dto);
        });
    });

    describe('remove', () => {
        it('should call service.remove', async () => {
          const id = 'uuid-1';
      
          service.remove.mockResolvedValue(undefined); // ou mockImplementation(() => Promise.resolve())
      
          await controller.remove(id);
      
          expect(service.remove).toHaveBeenCalledWith(id);
        });
      });      
});
