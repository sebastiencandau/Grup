import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';

describe('MailService', () => {
  let service: MailService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: HttpService,
          useValue: { post: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('doit envoyer un email avec le bon payload', async () => {
    (configService.get as jest.Mock).mockReturnValue('FAKE_API_KEY');
    (httpService.post as jest.Mock).mockReturnValue(of({ data: {} }));

    await service.sendReservationConfirmation('test@mail.com', 'Test Event', 3, 'TOKEN123');

    expect(httpService.post).toHaveBeenCalledWith(
      'https://api.brevo.com/v3/smtp/email',
      expect.objectContaining({
        sender: { name: 'Grup', email: 'scallpie@gmail.com' },
        to: [{ email: 'test@mail.com' }],
        subject: 'Confirmation de votre réservation',
        htmlContent: expect.stringContaining('Test Event'),
      }),
      {
        headers: {
          'api-key': 'FAKE_API_KEY',
          'Content-Type': 'application/json',
        },
      },
    );
  });

  it('doit logger une erreur si l\'envoi échoue', async () => {
    const loggerSpy = jest.spyOn(service['logger'], 'error');
    (configService.get as jest.Mock).mockReturnValue('FAKE_API_KEY');
    (httpService.post as jest.Mock).mockReturnValue(
      throwError(() => new Error('ECHEC_ENVOI'))
    );

    await service.sendReservationConfirmation('test@mail.com', 'Test Event', 3, 'TOKEN123');

    expect(loggerSpy).toHaveBeenCalledWith(
      expect.stringContaining('Erreur lors de l\'envoi de l\'email'),
      expect.any(String),
    );
  });
});
