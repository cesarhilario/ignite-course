import React, { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components/native';

import { useAuth } from '../../hooks/auth';
import { HighlightCard } from '../../components/HighlightCard';

import { ITransactionCardProps, TransactionCard } from '../../components/TransactionCard';

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer,
} from './styles';
import { ActivityIndicator } from 'react-native';

export interface IDataListProps extends ITransactionCardProps {
  id: string;
}

interface IHighlightProps {
  amount: string;
  lastTransaction: string;
}
interface IHighlightData {
  entries: IHighlightProps;
  expenses: IHighlightProps;
  total: IHighlightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<IDataListProps[]>([]);
  const [highlightCardsData, setHighlightCardsData] = useState<IHighlightData>({} as IHighlightData);
  const theme = useTheme();
  const { signOut, user } = useAuth();

  function getLastTransactionDate(collection: IDataListProps[], type: 'entry' | 'expense') {
    const collectionFiltered = collection.filter((transaction) => transaction.type === type);

    if (collectionFiltered.length === 0) {
      return 0;
    }

    const lastTransaction = new Date(
      Math.max.apply(
        Math,
        collectionFiltered.map((transaction) => new Date(transaction.date).getTime()),
      ),
    );
    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`;
  }

  async function loadTransactions() {
    const dataKey = `@gofinances:transactions_${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const transactions: IDataListProps[] = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expenseTotal = 0;

    const transcationsFormatted: IDataListProps[] = transactions.map((item: IDataListProps) => {
      if (item.type === 'entry') {
        entriesTotal += Number(item.amount);
      } else {
        expenseTotal += Number(item.amount);
      }

      const amount = Number(item.amount).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });

      const date = Intl.DateTimeFormat('pt-Br', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).format(new Date(item.date));

      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date,
      };
    });

    setTransactions(transcationsFormatted);

    const lastEntryTransactions = getLastTransactionDate(transactions, 'entry');
    const lastExpenseTransactions = getLastTransactionDate(transactions, 'expense');
    const totalInterval =
      lastExpenseTransactions === 0 ? 'Não há transaçoes' : `01 a ${lastExpenseTransactions}`;

    const total = entriesTotal - expenseTotal;
    setHighlightCardsData({
      entries: {
        amount: entriesTotal.toLocaleString('pr-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction:
          lastEntryTransactions === 0 ? 'Não há transaçoes' : `Última entrada dia ${lastEntryTransactions}`,
      },
      expenses: {
        amount: expenseTotal.toLocaleString('pr-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction:
          lastExpenseTransactions === 0 ? 'Não há transaçoes' : `Última saida dia ${lastExpenseTransactions}`,
      },
      total: {
        amount: total.toLocaleString('pr-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: totalInterval,
      },
    });

    setIsLoading(false);
  }

  /* Carrega as transações */
  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, []),
  );

  // Reinicia o loading
  useFocusEffect(
    useCallback(() => {
      return () => {
        setIsLoading(true);
      };
    }, []),
  );

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: user?.photo }} />
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>
          <HighlightCards>
            <HighlightCard
              type="up"
              title="Entradas"
              amount={highlightCardsData?.entries?.amount}
              lastTransaction={highlightCardsData.entries.lastTransaction}
            />
            <HighlightCard
              type="down"
              title="Saídas"
              amount={highlightCardsData?.expenses?.amount}
              lastTransaction={highlightCardsData.expenses.lastTransaction}
            />
            <HighlightCard
              type="total"
              title="Total"
              amount={highlightCardsData?.total?.amount}
              lastTransaction={highlightCardsData.total.lastTransaction}
            />
          </HighlightCards>
          <Transactions>
            <Title>Listagem</Title>
            <TransactionList
              keyExtractor={(item) => item.id}
              data={transactions}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
