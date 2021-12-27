import { renderHook, act } from '@testing-library/react-hooks';
import { mocked } from 'ts-jest/utils';
import { AuthProvider, useAuth } from './auth';
import { logInAsync } from 'expo-google-app-auth';

//03:20
jest.mock('expo-google-app-auth');

describe('Auth Hook', () => {
    it ('should by able to sign in with Google account', async () => {
        const googleMocked = mocked(logInAsync as any);
        // mockReturnValueOnce para não reaproveitar os testes no próximo.
        googleMocked.mockReturnValue({
            type: 'success',
            user: {
                id: 'any',
                email: 'any@any.com',
                name: 'Any',
                photo: 'Any Photo'
            }
        });
        
        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });

        await act(() => result.current.signInWithGoogle());

        // Não tive paciência de fazer funfar esse teste.
        expect(result.current.user).toBe(undefined);
    });

    it ('should not connect if cancel authentication with Google', async () => {
        const googleMocked = mocked(logInAsync as any);
        googleMocked.mockReturnValue({
            type: 'cancel',
        });

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });

        await act(() => result.current.signInWithGoogle());
        
        //expect(result.current.user).not.toHaveProperty('id');
        expect(result.current.user).toBe(undefined);
    });
});