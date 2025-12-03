import globalStyles from '@/src/styles/globalStyles';
import React from 'react';
import { Image, View } from 'react-native';

const Header = () => (
  <View style={globalStyles.header}>
    <Image source={require('@/assets/images/podcax-header.png')} style={globalStyles.headerIcon} />
  </View>
);

export default Header;
