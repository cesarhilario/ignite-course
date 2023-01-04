import React, { useState } from 'react';
import { View } from 'react-native';
import Dialog from 'react-native-dialog';

interface IModal {
  title: string;
  description: string;
  visible: boolean;
  handleSubmit: (text: string) => void;
  handleCancel: () => void;
}

export function Modal({
  title,
  description,
  visible,
  handleSubmit,
  handleCancel,
}: IModal) {
  const [text, setText] = useState('');

  return (
    <View>
      <Dialog.Container visible={visible}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
        <Dialog.Input onChangeText={setText} />
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Submit" onPress={() => handleSubmit(text)} />
      </Dialog.Container>
    </View>
  );
}
