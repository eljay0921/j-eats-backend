import { Test } from '@nestjs/testing';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailService } from './mail.service';

import got from 'got';
import * as FormData from 'form-data';
import { string } from 'joi';

// 모듈 자체를 mocking 하는 방법
jest.mock('got');
jest.mock('form-data');

const TEST_DOMAIN = 'test-domain';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: CONFIG_OPTIONS,
          useValue: {
            apiKey: 'test-apiKey',
            domain: TEST_DOMAIN,
            fromEmail: 'test-fromEmail',
          },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined.', async () => {
    expect(service).toBeDefined();
  });

  describe('sendVerificationEmail', () => {
    it('should call sendEmail', async () => {
      const sendVerificationEmailArgs = {
        email: 'some.mail@test.com',
        code: 'some.code',
      };

      // mockImplementation은 해당 함수의 구현부를 가로챌 수 있게 해주는 것
      jest.spyOn(service, 'sendEmail').mockImplementation(async () => {});

      service.sendVerificationEmail(
        sendVerificationEmailArgs.email,
        sendVerificationEmailArgs.code,
      );

      expect(service.sendEmail).toHaveBeenCalledTimes(1);
      expect(service.sendEmail).toHaveBeenCalledWith(
        'Verify your email~',
        'confirm_account',
        [
          { key: 'code', value: sendVerificationEmailArgs.code },
          { key: 'username', value: sendVerificationEmailArgs.email },
        ],
      );
    });
  });

  describe('sendEmail', () => {
    it('send email', async () => {
      service.sendEmail('', '', []);

      // new FormData();로 생성한 객체에서 append 함수를 활용하고 있으므로, prototype을 spying 해야함.
      // 그리고 object 자체를 mocking (spying) 하려는 목적이므로 mockImplementation은 구현하지 않는다.
      const formDataAppendSpy = jest.spyOn(FormData.prototype, 'append');
      expect(formDataAppendSpy).toHaveBeenCalled();
      expect(got).toHaveBeenCalledTimes(1);
      expect(got).toHaveBeenCalledWith(
        `https://api.mailgun.net/v3/${TEST_DOMAIN}/messages`,
        expect.any(Object),
      );
    });
  });
});
