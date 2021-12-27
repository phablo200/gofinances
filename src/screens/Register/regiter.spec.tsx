import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import theme from '../../global/styles/theme';
import { Register } from '.';

const Provider: React.FC = ({ children }) => (
    <ThemeProvider theme={theme}>
        { children }
    </ThemeProvider>
);

describe('Register screen', () => {
    it ('should be open category modal when user click on the category button', async () => {
        const { getByTestId } = render(
            <Register />,
            {
                wrapper: Provider
            }
        );

        const categoryModal = getByTestId('modal-category');
        const buttonCategory = getByTestId('button-category');

        fireEvent.press(buttonCategory);
        expect(categoryModal.props.visible).toBeTruthy();

        // Para lidar com asyncronismo

        /* 
        await waitFor(() => { 
            expect(categoryModal.props.visible).toBeTruthy();
        });
        */
    });
});

