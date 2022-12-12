import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import { Container, Title } from './styles';

interface IProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
}

export function Button({ title, onPress, testID, ...rest }: IProps) {
  return (
    <Container onPress={onPress} testID={testID} {...rest}>
      <Title>{title}</Title>
    </Container>
  );
}
