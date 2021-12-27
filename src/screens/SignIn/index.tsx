import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';


import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

import { useAuth } from '../../hooks/auth';
import { SignSocialButton } from '../../components/SigninSocialButton';

import { 
    Container, 
    Header, 
    TitleWrapper, 
    Title, 
    SiginTitle, 
    Footer,
    FooterWrapper
} from './styles';

export const SignIn = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { signInWithGoogle, signInWithApple } = useAuth();
    const theme = useTheme();

    const handleSignInWithGoogle = async () => {
        try {
            setIsLoading(true);
            return await signInWithGoogle();
        } catch(error) {
            Alert.alert('Erro :(', 'Houve um erro inesperado, tente um outro método de autenticação ou utilize login e senha');
            setIsLoading(false);
        }
    };

    const handleSignInWithApple = async () => {
        try {
            setIsLoading(false);
            return await signInWithApple();
        } catch (error) {
            console.log(error);

            Alert.alert('Não foi possível conectar a conta Apple');
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg width={RFValue(120)} height={RFValue(68)} />

                    <Title>Controle suas finâncias de forma muito simples</Title>
                </TitleWrapper>

                <SiginTitle>
                    Faça seu login com uma das contas abaixo
                </SiginTitle>
            </Header>
            <Footer>
                <FooterWrapper>
                    <SignSocialButton title="Entrar com o google" 
                        svg={GoogleSvg} 
                        onPress={handleSignInWithGoogle}
                    />
                    {
                        Platform.OS === 'ios' && (
                            <SignSocialButton title="Entrar com a Apple" 
                                svg={AppleSvg} 
                                onPress={handleSignInWithApple}
                            />
                        )
                    }
                </FooterWrapper>
                { isLoading && (
                    <ActivityIndicator  
                        color={theme.colors.shape} 
                        style={{marginTop: 18}}
                    />    
                )}
            </Footer>
        </Container>
    );
};
