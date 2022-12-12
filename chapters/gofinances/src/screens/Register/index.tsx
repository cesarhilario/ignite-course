import React, { useCallback, useState } from 'react';
import { Keyboard, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import uuid from 'react-native-uuid';
import { useForm } from 'react-hook-form';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';

import { Button } from '../../components/Form/Button';
import { InputForm } from '../../components/Form/InputForm';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';

import { CategorySelect } from '../CategorySelect';

import { Container, Header, Title, Form, Fields, TransactionsTypes } from './styles';

interface IFormData {
  name: string;
  amount: string;
}

const schema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  amount: yup
    .number()
    .typeError('Informe um valor numérico')
    .positive('O valor não pode ser negativo')
    .required('O valor é obrigatório'),
});

export function Register(): JSX.Element {
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCateogoryModalOpen] = useState(false);
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });
  const { user } = useAuth();
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  function cleanForm() {
    reset();
    setTransactionType('');
    setCategory({
      key: 'category',
      name: 'Categoria',
    });
  }

  function handleTransactionTypeSelect(transactionType: 'entry' | 'expense') {
    setTransactionType(transactionType);
  }

  function handleOpenSelectCategoryModal() {
    setCateogoryModalOpen(true);
  }

  function handleCloseSelectCategoryModal() {
    setCateogoryModalOpen(false);
  }

  async function handleRegister(form: Partial<IFormData>) {
    if (!transactionType) {
      Alert.alert('Selectione o tipo da transação.');
      return;
    }
    if (category.key === 'category') {
      Alert.alert('Selecione a categoria.');
      return;
    }
    if (category.key === 'category') {
      Alert.alert('Selecione a categoria.');
      return;
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
      const dataKey = `@gofinances:transactions_${user.id}`;
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];
      const dataFormatted = [...currentData, newTransaction];
      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

      cleanForm();

      navigation.navigate('Listing');
    } catch (error) {
      Alert.alert('Erro!', 'Não foi possível salvar.');
      throw new Error(error as string);
    }
  }

  /** Limpa o formulário ao sair da tela */
  useFocusEffect(useCallback(() => () => cleanForm(), []));

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>
        <Form>
          <Fields>
            <InputForm
              placeholder="Nome"
              name="name"
              control={control}
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              placeholder="Preço"
              name="amount"
              control={control}
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />

            <TransactionsTypes>
              <TransactionTypeButton
                title="Entrada"
                type="entry"
                onPress={() => handleTransactionTypeSelect('entry')}
                isActive={transactionType === 'entry'}
              />
              <TransactionTypeButton
                title="Saída"
                type="expense"
                onPress={() => handleTransactionTypeSelect('expense')}
                isActive={transactionType === 'expense'}
              />
            </TransactionsTypes>

            <CategorySelectButton
              testID="button-category"
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>

          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>

        <Modal testID="modal-category" visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}
