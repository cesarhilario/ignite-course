import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { useAuth } from '../../hooks/auth';

import { categories } from '../../utils/categories';

import { ITransactionCardProps } from '../../components/TransactionCard';
import { HistoryCard } from '../../components/HistoryCard';

import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadContainer,
} from './styles';

interface ICategoryData {
  key: string;
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percent: string;
}

interface ICategoryDataToChart {
  x: string;
  y: number;
}

export function Summary() {
  const [isLoading, setIsLoading] = useState(true);
  const [totalByCategories, setTotalByCategories] = useState<ICategoryData[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const theme = useTheme();
  const bottomTabBarHeight = useBottomTabBarHeight();
  const { user } = useAuth();

  /** Carrega os dados de despensas  */
  useFocusEffect(
    useCallback(() => {
      loadData();
      return () => {
        setIsLoading(true);
      };
    }, [selectedDate]),
  );

  function handleDateChange(action: 'next' | 'prev') {
    if (action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  async function loadData() {
    const dataKey = `@gofinances:transactions_${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted: ITransactionCardProps[] = response ? JSON.parse(response) : [];
    const expenses = responseFormatted.filter(
      (expense) =>
        expense.type === 'expense' &&
        new Date(expense.date).getMonth() === selectedDate.getMonth() &&
        new Date(expense.date).getFullYear() === selectedDate.getFullYear(),
    );
    const expensesTotal = expenses.reduce((accumulator: number, expense: ITransactionCardProps) => {
      return accumulator + Number(expense.amount);
    }, 0);
    const totalByCategory: ICategoryData[] = [];

    categories.forEach((category) => {
      let categorySum = 0;

      expenses.forEach((expense) => {
        if (expense.category === category.key) {
          categorySum += Number(expense.amount);
        }
      });

      if (categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });
        const percent = `${((categorySum / expensesTotal) * 100).toFixed(2)}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          total: categorySum,
          totalFormatted,
          color: category.color,
          percent,
        });
      }
    });
    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <Title>Resumo por categoria</Title>
          </Header>

          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: bottomTabBarHeight,
            }}
          >
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
              <VictoryPie
                data={totalByCategories}
                x={(category) => category.percent}
                y={(category) => category.total}
                colorScale={totalByCategories.map((category) => category.color)}
                style={{
                  labels: {
                    fontSize: RFValue(18),
                    fill: theme.colors.shape,
                    // fontFamily: theme.fonts.bold,
                  },
                }}
                labelRadius={50}
              />
            </ChartContainer>

            {totalByCategories.map((category) => (
              <HistoryCard
                key={category.name}
                title={category.name}
                amount={category.totalFormatted}
                color={category.color}
              />
            ))}
          </Content>
        </>
      )}
    </Container>
  );
}
