
import React, { useEffect, useState } from 'react';
import { LinkingOptions, NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { RootParamList } from './type/navigationType';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetProvider } from './context/BottomSheetContext';
import { store } from './redux/store';
import FallbackScreen from './screens/FallbackScreen';
import { Linking } from 'react-native';
import Toast from 'react-native-toast-message';
import SplashScreen from './screens/SplashScreen';
import MainScreen from './screens/MainScreen';
import ProfileScreen from './screens/ProfileScreen';
import VerifyScreen from './screens/VerifyScreen';
import RegisterFinalScreen from './screens/RegisterFinalScreen';
import VerifySuccessScreen from './screens/VerifySuccessScreen';
import NotificationScreen from './screens/NotificationScreen';
import CreateScreen from './screens/CreateScreen';
import SearchScreen from './screens/SearchScreen';
const Stack = createStackNavigator<RootParamList>();
// Cấu hình Deep Link
const linking: LinkingOptions<RootParamList> = {
  prefixes: ["castify://", "https://castify.vercel.app"], // Các URL scheme
  config: {
    screens: {
      Verify: {
        path: "verify",
        parse: {
          token: (token: string) => `${token}`,
        },
      },
    },
  },
};

// Main App
const App = () => {
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      console.log("Deep Link Received:", event.url);
    };

    // Lắng nghe deep link khi app đang mở
    Linking.addEventListener("url", handleDeepLink);

    // Xử lý deep link khi app được mở từ trạng thái đóng
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      Linking.removeAllListeners("url");
    };
  }, []);


  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetProvider>
          <NavigationContainer linking={linking} fallback={<FallbackScreen />}>
            <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#fff' } }}>
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="Main" component={MainScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Verify" component={VerifyScreen} />
              <Stack.Screen name="RegisterFinal" component={RegisterFinalScreen} />
              <Stack.Screen name="VerifySuccess" component={VerifySuccessScreen} />
              <Stack.Screen name="Notification" component={NotificationScreen} />
              <Stack.Screen name="Create" component={CreateScreen} />
              <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
            <Toast />
          </NavigationContainer>
        </BottomSheetProvider>
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;
