import { Test } from '@nestjs/testing';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailService } from './mail.service';

jest.mock('got', () => {});
jest.mock('form-data', () => {
  return {
    append: jest.fn(),
  };
});

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
            domain: 'test-domain',
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
  it.todo('sendEmail');
});
