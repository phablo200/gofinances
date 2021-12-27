import React, { useState, useEffect } from 'react';
import { 
    Keyboard, 
    TouchableWithoutFeedback, 
    Modal,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';

import { Container, Header, Title, Form, Fields, TransactionsType } from './styles';
import { InputForm  } from '../../components/Form/InputForm';

import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { CategorySelect } from '../CategorySelect';

interface FormData {
    name: string;
    amount: string;
};

const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    amount: Yup.number().typeError('Informe um valor númerico')
        .positive('O valor não pode ser negativo')
        .required('O valor é obrigatório')
});

const dataKey = '@gofinances:transactions';
            
export function Register () {
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria'
    });

    const { user } = useAuth();
    const navigation = useNavigation();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(schema)
    });

    const handleTransactionsTypeSelect = (type: 'positive' | 'negative') => {
        setTransactionType(type);
    };  

    const handleCloseSelectCategoryModal = () => {
        setCategoryModalOpen(false);
    };

    const handleOpenSelectCategoryModal = () => {
        setCategoryModalOpen(true);
    };

    const handleRegister = async (form: FormData) => {
        if (!transactionType) {
            return Alert.alert('Atenção', 'Selecione o tipo da transação');
        }

        if (category.key === 'category') {
            return Alert.alert('Atenção', 'Selecione a categoria');
        }

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date(),
        };

        try {
            const key = `${dataKey}_user:${user.id}`;
            const data = await AsyncStorage.getItem(key);
            const currentData = data ? JSON.parse(data) : [];

            const dataFormated = [
                ...currentData,
                newTransaction
            ];

            await AsyncStorage.setItem(key, JSON.stringify(dataFormated));

            reset();
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Categoria'
            });

            navigation.navigate('Listagem');
        } catch (error) {
            console.log(error);
            Alert.alert('Não foi possível salvar a categoria.');   
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                    <Title>Cadastro</Title>
                </Header>
                
                <Form>
                    <Fields>
                        <InputForm control={control} 
                            name="name" 
                            placeholder="Nome"
                            autoCapitalize="sentences"
                            autoCorrect={false} 
                            error={errors.name && errors.name.message}   
                        />

                        <InputForm control={control} 
                            name="amount" 
                            placeholder="Preço" 
                            keyboardType="numeric"
                            error={errors.amount && errors.amount.message} 
                        />

                        <TransactionsType>
                            <TransactionTypeButton 
                                type="up" 
                                title="Income" 
                                onPress={() => handleTransactionsTypeSelect('positive')}
                                isActive={transactionType === 'positive'}
                            />
                            <TransactionTypeButton 
                                type="down" 
                                title="Outcome" 
                                onPress={() => handleTransactionsTypeSelect('negative')}
                                isActive={transactionType === 'negative'}
                            />
                        </TransactionsType>

                        <CategorySelectButton 
                            testID="button-category"
                            title={category.name} 
                            onPress={handleOpenSelectCategoryModal}    
                        />
                    </Fields>

                    <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
                </Form>

                <Modal visible={categoryModalOpen} testID="modal-category">
                    <CategorySelect 
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </Modal>
            </Container>
        </TouchableWithoutFeedback>
    );
};