import React from 'react';
import { render } from '@testing-library/react-native';
import { Profile } from '../../screens/Profile';

describe('Profile', () => {
    it('should have a input name placeholder correctly', () => {
        const { getByPlaceholderText } = render(<Profile />);
        
        const inputName = getByPlaceholderText('Nome');
    
        expect(inputName).toBeTruthy();
    });
    
    it('should load a user', () => {
        const { getByTestId } = render(<Profile />);
    
        const inputName = getByTestId('input-name');
        const inputSurname = getByTestId('input-surname');
    
        expect(inputName.props.value).toEqual('Rodrigo');
        expect(inputSurname.props.value).toEqual('Gonçalves');
    });
    
    
    it('should exist title correctly', () => {
        const { getByTestId } = render(<Profile />);
    
        expect(getByTestId('text-title').props.children).toContain('Perfil');
    });
});
