import { renderHook, act } from '@testing-library/react-hooks';
import { mocked } from 'ts-jest/utils';

import { AuthProvider, useAuth } from './auth';

describe('Auth Hook', () => {
  beforeAll(() => {
    jest.restoreAllMocks();
  });

  it('should be able to sign in with Google account existing', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            email: `userInfo.email@email.com`,
            name: `userInfo.given_name`,
            photo: `userInfo.picture`,
            locale: 'userInfo.locale',
            verified_email: 'userInfo_verified_email',
          }),
      }),
    ) as jest.Mock;

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(() => result.current.signInWithGoogle());

    expect(result.current.user.email).toBe('userInfo.email@email.com');
  });

  it('user should not connect if cancel authentication with Google', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      }),
    ) as jest.Mock;

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(() => result.current.signInWithGoogle());

    expect(result.current.user).not.toHaveProperty('id');
  });
});
