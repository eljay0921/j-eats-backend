import got from 'got';
import * as FormData from 'form-data';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOptions } from './mail.interface';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {
    this.sendEmail('Test Subject !!', 'Test Contents !!!!!'); // 테스트 용
  }

  private async sendEmail(subject: string, content: string) {
    const form = new FormData();
    // 보내는 사람
    form.append('from', `Excited User <mailgun@${this.options.domain}>`);
    // 받는 사람을 지정할 수 있지만, 우리는 mailgun에 카드를 등록하지 않았으므로, 인증된 메일로만 보낼 수 있다.
    form.append('to', `ivynk0921@gmail.com`);
    form.append('subject', subject);
    form.append('text', content);

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

    console.log(response.body);
  }
}
