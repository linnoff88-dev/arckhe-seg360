import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  const mockContext = (role: string) =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user: { id: '1', email: 'test@test.com', role } }),
      }),
    }) as unknown as ExecutionContext;

  it('should allow access when no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    expect(guard.canActivate(mockContext('CONSUMER'))).toBe(true);
  });

  it('should allow ADMIN access to admin-only routes', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);
    expect(guard.canActivate(mockContext('ADMIN'))).toBe(true);
  });

  it('should deny CONSUMER access to admin-only routes', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);
    expect(guard.canActivate(mockContext('CONSUMER'))).toBe(false);
  });

  it('should deny BROKER access to admin-only routes', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);
    expect(guard.canActivate(mockContext('BROKER'))).toBe(false);
  });

  it('should allow BROKER access to broker routes', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['BROKER']);
    expect(guard.canActivate(mockContext('BROKER'))).toBe(true);
  });

  it('should allow access when user has one of multiple roles', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue(['CONSUMER', 'BROKER']);
    expect(guard.canActivate(mockContext('CONSUMER'))).toBe(true);
  });
});
