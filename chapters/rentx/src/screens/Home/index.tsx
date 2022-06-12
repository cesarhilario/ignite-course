import React from 'react';
import { StatusBar } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { Car } from '../../components/Car';
import Logo from '../../assets/logo.svg';

import { Container, Header, TotalCars, HeaderContent, CarList } from './styles';

export function Home() {
  const carData = [
    {
      brand: 'Audi',
      name: 'RS 5 Coupe',
      rent: {
        period: 'Ao dia',
        price: 120,
      },
      thumbnail:
        'https://png.monster/wp-content/uploads/2020/11/2018-audi-rs5-4wd-coupe-angular-front-5039562b.png',
    },
    // {
    //   brand: 'Prosche',
    //   name: 'RS 5 Coupe',
    //   rent: {
    //     period: 'Ao dia',
    //     price: 340,
    //   },
    //   thumbnail: 'https://www.pngkit.com/png/full/237-2375888_porsche-panemera-s.png',
    // },
  ];

  return (
    <Container>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Header>
        <HeaderContent>
          <Logo width={RFValue(108)} height={RFValue(12)} />
          <TotalCars>Total de 12 carros</TotalCars>
        </HeaderContent>
      </Header>
      <CarList
        data={[1, 2, 3]}
        keyExtractor={(item) => String(item)}
        renderItem={(item) => <Car data={carData[0]} />}
      />
    </Container>
  );
}
