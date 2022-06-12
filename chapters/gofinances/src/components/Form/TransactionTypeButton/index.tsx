import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';

import { Container, Title, Icon, Button } from './styles';

const icons = {
  entry: 'arrow-up-circle',
  expense: 'arrow-down-circle',
};

interface IProps extends RectButtonProps {
  title: string;
  type: 'entry' | 'expense';
  isActive: boolean;
}

export function TransactionTypeButton({ title, type, isActive, ...rest }: IProps) {
  return (
    <Container type={type} isActive={isActive}>
      <Button {...rest}>
        <Icon name={icons[type]} type={type} />
        <Title>{title}</Title>
      </Button>
    </Container>
  );
}
