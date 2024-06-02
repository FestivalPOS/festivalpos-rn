import React, { useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { usePOS } from '../contexts/POS.context';
import { useCart } from '../contexts/Cart.context';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const maxTileSize = Math.min(width / 4, height / 3, 200);

const POSScreen = ({ navigation }) => {
  const { pos, loading } = usePOS();
  const { cart, setCart } = useCart();
  const { t } = useTranslation();

  const totalTranslateX = useSharedValue(0);
  const binTranslateX = useSharedValue(-50);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: pos.name ? `POS  -  ${pos.name}` : 'POS',
    });
  }, [pos.name, navigation]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const count = prevCart[product.id] ? prevCart[product.id] + 1 : 1;
      return { ...prevCart, [product.id]: count };
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      if (!prevCart[productId]) return prevCart;
      const newCount = prevCart[productId] - 1;
      if (newCount <= 0) {
        const { [productId]: _, ...rest } = prevCart;
        return rest;
      }
      return { ...prevCart, [productId]: newCount };
    });
  };

  const calculateTotal = () => {
    return Object.keys(cart).reduce((sum, productId) => {
      const product = pos.products.find((p) => p.id === productId);
      return sum + (product?.price ?? 0) * cart[productId];
    }, 0);
  };

  const handlePress = () => {
    if (totalTranslateX.value === 0 && calculateTotal() != 0) {
      totalTranslateX.value = withSpring(60, {
        duration: 200,
        dampingRatio: 1.5,
      });
      binTranslateX.value = withSpring(50, {
        duration: 200,
        dampingRatio: 1.5,
      });
    } else {
      totalTranslateX.value = withSpring(0, {
        duration: 200,
        dampingRatio: 1.5,
      });
      binTranslateX.value = withSpring(-40, {
        duration: 200,
        dampingRatio: 1.5,
      });
    }
  };

  const clearCartPress = () => {
    totalTranslateX.value = withSpring(0, { duration: 200, dampingRatio: 1.5 });
    binTranslateX.value = withSpring(-40, { duration: 200, dampingRatio: 1.5 });
    setCart({});
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: totalTranslateX.value }],
  }));

  const binStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: binTranslateX.value }],
    opacity: totalTranslateX.value > 0 ? 1 : 0,
  }));

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size="large" color={Colors.icon} />
        </View>
      ) : pos.products && pos.products.length > 0 ? (
        <ScrollView contentContainerStyle={styles.productContainer}>
          {pos.products.map((item) => (
            <View style={styles.productItem} key={item.id}>
              <Pressable
                onPress={() => addToCart(item)}
                style={[
                  styles.productSquare,
                  { backgroundColor: item.tilecolor },
                ]}
              >
                {item.imageLocal && (
                  <Image
                    source={{ uri: item.imageLocal }}
                    style={styles.productImage}
                  />
                )}
                <Text style={[styles.text, styles.productText]}>
                  {item.name}
                  {'\n'}CHF {item.price.toFixed(2)}
                </Text>
                {cart[item.id] > 0 && (
                  <Pressable
                    style={styles.itemCountCircle}
                    onPress={() => removeFromCart(item.id)}
                  >
                    <Text style={styles.itemCountText}>{cart[item.id]}</Text>
                  </Pressable>
                )}
              </Pressable>
            </View>
          ))}
        </ScrollView>
      ) : (
        <>
          <Text style={styles.noProductsText}>
            {t('screens.pos.no_products_available')}
          </Text>
        </>
      )}

      <View style={styles.cartSummary}>
        <View style={styles.cartTotalContainer}>
          <Animated.View style={[styles.binContainer, binStyle]}>
            <Pressable onPress={clearCartPress}>
              <View style={styles.binBackground}>
                <Ionicons name="trash-outline" size={24} color="white" />
              </View>
            </Pressable>
          </Animated.View>

          <Animated.View style={[animatedStyle]}>
            <Pressable onPress={handlePress}>
              <Text style={styles.cartTotal}>
                {t('screens.pos.total')}: CHF {calculateTotal().toFixed(2)}
              </Text>
            </Pressable>
          </Animated.View>
        </View>
        <Pressable
          style={
            Object.keys(cart).length === 0
              ? styles.checkoutButtonInactive
              : styles.checkoutButton
          }
          onPress={() => navigation.navigate('checkout', { pos })}
          disabled={Object.keys(cart).length === 0}
        >
          {/* <Image
            style={styles.checkoutIcon}
            source={require('../assets/buyer-pay-icon.svg')}
          /> */}
          <Ionicons name="wallet-outline" size={20} color="white" />
          <Text style={styles.checkoutButtonText}>
            {t('screens.pos.cash_in')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  text: {
    color: Colors.text,
  },
  activityIndicator: {
    marginVertical: 20,
  },
  productContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    padding: 12,
  },
  productItem: {
    width: maxTileSize,
    margin: 8,
    alignItems: 'center',
  },
  productSquare: {
    width: maxTileSize,
    height: maxTileSize,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.icon,
    borderRadius: 8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: maxTileSize - 32,
    height: maxTileSize - 64,
    marginBottom: 8,
  },
  productText: {
    fontSize: 16,
    textAlign: 'center',
  },
  itemCountCircle: {
    position: 'absolute',
    top: -16,
    left: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  noProductsText: {
    textAlign: 'center',
    fontSize: 18,
    color: Colors.text,
    marginTop: 20,
    marginBottom: 20,
  },
  cartSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: Colors.background,
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'darkgreen',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  checkoutButtonInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  checkoutButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  checkoutIcon: {
    height: 30,
    width: 20,
  },
  cartTotalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  binContainer: {
    position: 'absolute',
    left: -50,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  binBackground: {
    backgroundColor: 'darkred',
    borderRadius: 12,
    padding: 8,
  },
});

export default POSScreen;
