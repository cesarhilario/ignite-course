import React from 'react';
import { TextInputProps } from 'react-native';

import { Container } from './styles';

type TProps = TextInputProps & {
  placeholderTextColor?: string;
};

export function Input({ ...rest }: TProps) {
  return <Container {...rest} />;
}
