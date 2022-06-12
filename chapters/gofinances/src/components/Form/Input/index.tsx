import React from 'react';
import { TextInputProps } from 'react-native';

import { Container } from './styles';

type TProps = TextInputProps;

export function Input({ ...rest }: TProps) {
  return <Container {...rest} />;
}
