import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import { fetchProducts } from '../services/api'; // Ensure you have the fetchProducts function in your services
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');
const maxTileSize = Math.min(width / 5, height / 3, 150);

const POSScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});

  useEffect(() => {
    const loadProducts = async () => {
      const products = await fetchProducts();
      setProducts(products);
    };
    loadProducts();
  }, []);

  const addToCart = (product:Product) => {
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

  const resetCart = () => {
    setCart({});
  };

  const calculateTotal = () => {
    return Object.keys(cart).reduce((sum, productId) => {
      const product = products.find((p) => p.id === parseInt(productId, 10));
      return sum + (product.price * cart[productId]);
    }, 0);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.productContainer}>
        {products.map((item) => (
          <View style={styles.productItem} key={item.id}>
            <TouchableOpacity onPress={() => addToCart(item)} style={styles.productSquare}>
              {item.imageLocal && <Image source={{ uri: item.imageLocal }} style={styles.productImage} />}
              <Text style={[styles.text, styles.productText]}>{item.name}{"\n"}CHF {item.price.toFixed(2)}</Text>
              {cart[item.id] > 0 && (
                <TouchableOpacity style={styles.itemCountCircle} onPress={() => removeFromCart(item.id)}>
                  <Text style={styles.itemCountText}>{cart[item.id]}</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={styles.cartSummary}>
        <Text style={styles.cartTotal}>Total: CHF {calculateTotal().toFixed(2)}</Text>

        <TouchableOpacity
          style={(Object.keys(cart).length == 0) ? styles.checkoutButtonInactive : styles.checkoutButton}
          onPress={() => navigation.navigate('Checkout', { cart, products, resetCart })}
          disabled={(Object.keys(cart).length == 0)}
        >
          <Image style={styles.checkoutIcon} source={require('../assets/buyer_pay_icon.png')}></Image>
          <Text style={styles.checkoutButtonText}>Einkassieren</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    color: Colors.text,
    backgroundColor: Colors.background
  },
  text: {
    color: Colors.text
  },
  productContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 12
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
    alignItems: 'center'
  },
  productImage: {
    width: maxTileSize - 32,
    height: maxTileSize - 64,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  productText: {
    fontSize: 16,
    textAlign: 'center',
  },
  itemCountCircle: {
    position: 'absolute',
    top: -12,
    left: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCountText: {
    color: '#fff',
    fontWeight: 'bold',
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
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  checkoutButtonInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222',
    borderRadius: 25,
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
    resizeMode: 'center'
  }
});


export default POSScreen;
