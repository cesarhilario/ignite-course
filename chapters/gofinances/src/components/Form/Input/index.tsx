import React from 'react';
import { TextInputProps } from 'react-native';

import { Container } from './styles';

export interface Props extends TextInputProps {
  placeholderTextColor?: string;
  active?: boolean;
}

export function Input({ active = false, ...rest }: Props) {
  return <Container active={active} {...rest} />;
}
