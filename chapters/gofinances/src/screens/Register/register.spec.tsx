import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';

import { Register } from '.';
import theme from '../../global/styles/theme';
import { act } from 'react-test-renderer';

interface ProviderProps extends React.PropsWithChildren {}

const Providers: React.FC = ({ children }: ProviderProps) => (
  <NavigationContainer>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </NavigationContainer>
);

describe('Register Screen', () => {
  it('should be open category modal when user click on button', async () => {
    const { getByTestId } = render(<Register />, {
      wrapper: Providers,
    });
    const categoryModal = getByTestId('modal-category');
    const buttonCategory = getByTestId('button-category');

    act(() => {
      fireEvent.press(buttonCategory);
    });

    await waitFor(
      () => {
        expect(categoryModal.props.visible).toBeTruthy();
      },
      {
        timeout: 2000,
      },
    );
  });
});
