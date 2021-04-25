import { Test } from '@nestjs/testing';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { JwtService } from './jwt.service';
import * as jwt from 'jsonwebtoken';

const TESTKEY = 'test-key';
const UserID = 1;

jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(() => 'SOMETHING.TOKEN'),
    verify: jest.fn(() => ({ id: UserID })),
  };
});

describe('JWTService', () => {
  let service: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: CONFIG_OPTIONS,
          useValue: { privateKey: TESTKEY },
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  it('should be defined.', async () => {
    expect(service).toBeDefined();
  });

  describe('sign', () => {
    it('shold return a signed token', async () => {
      const token = await service.sign(UserID);
      expect(typeof token).toBe('string');
      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledWith({ id: UserID }, TESTKEY);
    });
  });

  describe('verify', () => {
    it('should return the decoded token', async () => {
      const token = 'any.token';
      const decodedToken = service.verify(token);
      expect(decodedToken).toEqual({ id: UserID });
      expect(jwt.verify).toHaveBeenCalledTimes(1);
      expect(jwt.verify).toHaveBeenCalledWith(token, TESTKEY);
    });
  });
});
