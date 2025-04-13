import React, {useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Home' as never);
    }, 5000); // 10 giây

    return () => clearTimeout(timer); // Clear timer khi component unmount
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/catImage.jpeg')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 300,
    height: 300,
  },
});

export default SplashScreen;
