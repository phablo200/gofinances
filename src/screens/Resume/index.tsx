import React, { useCallback, useState } from 'react';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ActivityIndicator } from 'react-native';

import { useTheme } from 'styled-components';
import { useAuth } from '../../hooks/auth';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { 
    Container, 
    Header, 
    Title, 
    Content, 
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month 
} from './styles';

import { HistoryCard } from '../../components/HistoryCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { categories } from '../../utils/categories';
import { LoadingContainer } from '../Dashboard/styles';
import { useFocusEffect } from '@react-navigation/core';

interface TransactionData {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
};

interface CategoryData {
    key: string;
    name: string;
    color: string;
    total: number;
    totalFormatted: string;
    percent: string;
};

export function Resume () {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date()); 
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
    
    const theme = useTheme();
    const { user } = useAuth();

    const handleDateChange = (action: 'next' | 'prev') => {
        if (action === 'next') {
            setSelectedDate(addMonths(selectedDate, 1));
        } else {
            setSelectedDate(subMonths(selectedDate, 1));
        }
    }

    useFocusEffect(useCallback(() => {
        loadData();
    }, [selectedDate]));

    const loadData = async () => {
        setIsLoading(true);

        const dataKey = `@gofinances:transactions_user:${user.id}`;
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];
        
        // Incrementar filtro.
        const expensives = responseFormatted
            .filter((expensive: TransactionData) => (
                expensive.type === 'negative' 
                && new Date(expensive.date).getMonth() === selectedDate.getMonth()
                && new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
            ));

        const expensivesTotal = expensives.reduce((acumullator: number, expensive: TransactionData) => {
            return acumullator + Number(expensive.amount);
        }, 0);

        const totalByCategory: CategoryData[] = [];

        categories.forEach(category => {
            let categorySum = 0;
            expensives.forEach((expensive: TransactionData) => {
                if (expensive.category === category.key) {
                    categorySum += Number(expensive.amount);
                }
            });

            if (categorySum > 0) {

                const totalFormatted = categorySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });

                const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`;

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    color: category.color,
                    total: categorySum,
                    totalFormatted,
                    percent
                });
            }
        });
        
        setTotalByCategories(totalByCategory); 
        setIsLoading(false);
    };

    return (
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>
            { isLoading ? (
                <LoadingContainer>
                    <ActivityIndicator color={theme.colors.primary} />
                </LoadingContainer>
            ) : (
                <Content showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 24,
                        flex: 1,
                        paddingBottom: useBottomTabBarHeight(),
                    }}>
                    <MonthSelect>
                        <MonthSelectButton onPress={() => handleDateChange('prev')}>
                            <MonthSelectIcon name="chevron-left" />
                        </MonthSelectButton>
                        <Month>{format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}</Month>
                        <MonthSelectButton onPress={() => handleDateChange('next')}>
                            <MonthSelectIcon name="chevron-right" />
                        </MonthSelectButton>
                    </MonthSelect>


                    <ChartContainer>
                        <VictoryPie data={totalByCategories}
                            colorScale={totalByCategories.map(category => category.color)}
                            style={{
                                labels: {
                                    fontSize: RFValue(18),
                                    fontWeight: 'bold',
                                    fill: theme.colors.shape
                                }
                            }} 
                            labelRadius={50}
                            x="percent"
                            y="total"
                        />
                    </ChartContainer>
                    { 
                        totalByCategories.map(item => (
                            <HistoryCard key={item.key}
                                title={item.name} 
                                amount={item.totalFormatted} 
                                color={item.color}
                            />
                        ))
                    }
                </Content>
            )
            }
        </Container>
    );
};

