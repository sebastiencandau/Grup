import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly brevoApiUrl = 'https://api.brevo.com/v3/smtp/email';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async sendReservationConfirmation(email: string, title: string, participantsCount: number, token: string) {
    const htmlContent = `
      <div style="font-family: sans-serif; color: #333;">
        <h2 style="color: #2F855A;">Réservation confirmée</h2>
        <p>Bonjour,</p>
        <p>Votre réservation pour <strong>${title}</strong> a été enregistrée.</p>
        <p><strong>Nombre de participants :</strong> ${participantsCount}</p>
        <p>
          Voir les détails : 
          <a href="https://monapp.com/reservations/${token}" style="color: #3182ce;">lien de la réservation</a>
        </p>
      </div>
    `;

    const apiKey = this.configService.get<string>('BREVO_API_KEY');

    console.log(apiKey)

    const payload = {
      sender: {
        name: 'Grup',
        email: 'scallpie@gmail.com',
      },
      to: [{ email }],
      subject: 'Confirmation de votre réservation',
      htmlContent,
    };

    try {
      await firstValueFrom(
        this.httpService.post(this.brevoApiUrl, payload, {
          headers: {
            'api-key': apiKey,
            'Content-Type': 'application/json',
          },
        }),
      );
      this.logger.log(`Email envoyé à ${email}`);
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de l'email: ${error.message}`, error.stack);
    }
  }
}
