import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";
import * as AuthSession from 'expo-auth-session';
import { AsyncStorage } from 'react-native';
const { CLIENT_ID, REDIRECT_URI } = process.env;


interface AuthProviderProps {
    children: ReactNode
};

interface User {
    id: number;
    name: string;
    email: string;
    photo?: string;
};

interface AuthorizationResponse {
    params: {
        access_token: string;
    },
    type: string;
};

interface IAuthContextData {
    user: User;
    signInWithGoogle(): Promise<void>;
    signInWithApple(): Promise<void>;
    signOut(): void;
    userStorageLoading: boolean;
};

const userStorageKey = '@gofinances:user';

const AuthContext = createContext({} as IAuthContextData);

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User>({} as User);
    const [userStorageLoading, setUserStorageLoading] = useState(true);

    const signInWithGoogle = async () => {
        /** 
        try {
            const clientId = CLIENT_ID ?? '58053402153-afival82lfsh58msitvohr7bj5q1nmmm.apps.googleusercontent.com';
            const redirectUri = REDIRECT_URI ?? 'https://auth.expo.io/@phablo220/gofinances';
            
            const RESPONSE_TYPE = 'token';
            const SCOPE = encodeURI('profile email');

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`; 
            const { type, params } = await AuthSession
                .startAsync({ authUrl }) as AuthorizationResponse;

            if (type === 'success') {
                const response = await fetch(`https://googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
                const userInfo = await response.json();
                
                const userLogged = {
                    id: userInfo.id,
                    email: userInfo.emal,
                    name: userInfo.given_name,
                    photo: userInfo.picture
                };

                setUser(userLogged);
                AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
            }
        } catch (error) {
            throw new Error(error);
        }*/

        const name = 'Phablo Vilas Boas';
        const photo = `https://ui-avatars.com/api/?name=${name}&length=1`;

        const userLogged = {
            id: 2,
            email: 'phablovilasboas25@gmail.com',
            name,
            photo
        };

        setUser(userLogged);
        AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
    };

    const signInWithApple = async () => {};

    const signOut = () => {
        setUser({} as User);
        AsyncStorage.removeItem(userStorageKey);
    }

    useEffect(() => {
        AsyncStorage.getItem(userStorageKey).then(response => {
            if (response) {
                return JSON.parse(response) as User
            }
        })
        .then(userLogged => {
            setUser(userLogged);
            setUserStorageLoading(false);
        })
    }, []);

    return (
        <AuthContext.Provider value={{ 
            user,
            signInWithGoogle,
            signOut,
            signInWithApple,
            userStorageLoading
        }}>
          { children }
        </AuthContext.Provider>
    );
};

const  useAuth = () => {
    const context = useContext(AuthContext);
    return context;
};

export { AuthProvider, useAuth };