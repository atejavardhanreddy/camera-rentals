import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { StyleSheet, Platform, View } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import CatalogScreen from './src/screens/CatalogScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import BrandsScreen from './src/screens/BrandsScreen';
import BrandDetailScreen from './src/screens/BrandDetailScreen';
import MenuScreen from './src/screens/MenuScreen';
import WebViewScreen from './src/screens/WebViewScreen';
import { Equipment } from './src/types';

export type RootStackParamList = {
  MainTabs: undefined;
  ProductDetail: { slug: string; equipment?: Equipment };
  BrandDetail: { brandName: string };
  WebView: { url: string; title: string };
};

export type MainTabParamList = {
  Home: undefined;
  Catalog: { categoryId?: number };
  Brands: undefined;
  Cart: undefined;
  Menu: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          elevation: 0,
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 90 : 72,
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(8,8,8,0.97)',
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView intensity={95} tint="dark" style={[StyleSheet.absoluteFill, { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.07)' }]} />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(8,8,8,0.97)', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.05)' }]} />
          )
        ),
        tabBarActiveTintColor: '#E31B23',
        tabBarInactiveTintColor: '#444444',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3, marginBottom: 2 },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'home';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Catalog') iconName = focused ? 'view-grid' : 'view-grid-outline';
          else if (route.name === 'Brands') iconName = focused ? 'tag-multiple' : 'tag-multiple-outline';
          else if (route.name === 'Cart') iconName = focused ? 'cart' : 'cart-outline';
          else if (route.name === 'Menu') iconName = focused ? 'account-circle' : 'account-circle-outline';
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "D'RENTALS" }} />
      <Tab.Screen name="Catalog" component={CatalogScreen} options={{ title: 'Catalog' }} />
      <Tab.Screen name="Brands" component={BrandsScreen} options={{ title: 'Brands' }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ title: 'My Cart' }} />
      <Tab.Screen name="Menu" component={MenuScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#09090b' },
            headerTintColor: '#f8fafc',
            headerTitleStyle: { fontWeight: '700' },
          }}
        >
          <Stack.Screen 
            name="MainTabs" 
            component={MainTabs} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="ProductDetail" 
            component={ProductDetailScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="BrandDetail" 
            component={BrandDetailScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="WebView" 
            component={WebViewScreen} 
            options={{ title: '', headerTransparent: true, headerTintColor: '#f8fafc' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
