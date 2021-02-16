import got from 'got';
import * as FormData from 'form-data';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { EmailVar, MailModuleOptions } from './mail.interface';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  private async sendEmail(
    subject: string,
    template: string,
    emailvars: EmailVar[],
  ) {
    try {
      const form = new FormData();
      form.append('from', `J by J-Eats <mailgun@${this.options.domain}>`);
      form.append('to', `ivynk0921@gmail.com`);
      form.append('subject', subject);
      form.append('template', template);
      emailvars.forEach(item => form.append(`v:${item.key}`, item.value));

      const response = await got(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
    } catch (error) {
      console.log(error);
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('Verify your email~', 'confirm_account', [
      { key: 'code', value: code },
      { key: 'username', value: email },
    ]);
  }
}
