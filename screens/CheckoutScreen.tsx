import React, { useRef, useState, useEffect, MutableRefObject } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  Modal,
  Dimensions,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { useCart } from '../contexts/Cart.context';
import { useSales } from '../contexts/Sales.context';
import { Sale } from '../types/Sale';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { postSale } from '../services/api';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const CheckoutScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { cart, resetCart } = useCart();
  const { addSale } = useSales();
  const { pos } = route.params;

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [givenAmount, setGivenAmount] = useState('');
  const [change, setChange] = useState(null);

  const amountInput: MutableRefObject<TextInput | null> =
    useRef<TextInput>(null);

  const calculateTotal = () => {
    return Object.keys(cart).reduce((sum, productId) => {
      const product = pos.products.find((p) => p.id === productId);
      return sum + product.price * cart[productId];
    }, 0);
  };

  const handlePayment = (method) => {
    if (method === 'Bar') {
      setIsModalVisible(true);
    } else {
      setSelectedPayment(method);
    }
  };

  const handleCalculateChange = () => {
    const total = calculateTotal();
    const amount = parseFloat(givenAmount);
    console.log(amount);
    if (amount >= 0) {
      const changeAmount = amount - total;
      setChange(changeAmount.toFixed(2));
      setSelectedPayment('Bar');
    } else {
      Toast.show({
        type: 'info',
        text1: t('screens.checkout.enter_amount'),
        text2: t('screens.checkout.enter_amount_description'),
        position: 'bottom',
        visibilityTime: 2000,
        bottomOffset: 90,
      });
    }
    setIsModalVisible(false);
  };

  const handleFinish = async () => {
    const saleData: Sale = {
      id: uuidv4(),
      vendorPointId: pos.id,
      saleDate: new Date(),
      saleItems: Object.keys(cart).map((productId) => {
        const product = pos.products.find((p) => p.id === productId);
        return {
          productId: productId,
          quantity: cart[productId],
          sellingPrice: product.price,
        };
      }),
    };

    resetCart();
    navigation.navigate('pos');

    const postUrl = pos.url.split('/pos')[0] + '/pos/sale';

    try {
      await postSale(saleData, postUrl);
      resetCart();
      navigation.navigate('pos');
    } catch (error) {
      console.info('Failed to post sale to API, saving to cache: ', error);
      addSale(saleData, postUrl);
      resetCart();
      navigation.navigate('pos');
    }
  };

  const total = calculateTotal().toFixed(2);

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        {Object.keys(cart).map((productId) => {
          const product = pos.products.find((p) => p.id === productId);
          return (
            <View key={product.id} style={styles.productItem}>
              <Text style={styles.productText}>
                {cart[productId]} x {product.name}
              </Text>
              <Text style={styles.productText}>
                CHF {(product.price * cart[productId]).toFixed(2)}
              </Text>
            </View>
          );
        })}
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>{t('screens.checkout.total')}:</Text>
          <Text style={styles.totalAmount}>CHF {total}</Text>
        </View>
        {change !== null && (
          <View style={styles.productItem}>
            <Text style={styles.changeText}>
              {t('screens.checkout.change')}:
            </Text>
            <Text style={styles.changeAmount}>CHF {change}</Text>
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        {selectedPayment === null ? (
          <>
            <Pressable style={styles.finishButton} onPress={handleFinish}>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="white"
              />
              <Text style={styles.paymentButtonText}>
                {t('screens.checkout.finalise')}
              </Text>
            </Pressable>
            {/* <Pressable style={styles.paymentButtonInactive} onPress={() => handlePayment('Twint')} disabled={true}>
              <Text style={styles.paymentButtonText}>Twint</Text>
            </Pressable> */}
            {calculateTotal() > 0 && (
              <Pressable
                style={styles.paymentButton}
                onPress={() => handlePayment('Bar')}
                disabled={calculateTotal() <= 0}
              >
                <Ionicons name="cash-outline" size={20} color="white" />
                <Text style={styles.paymentButtonText}>
                  {t('screens.checkout.cash')}
                </Text>
              </Pressable>
            )}
          </>
        ) : (
          <Pressable style={styles.finishButton} onPress={handleFinish}>
            <Ionicons name="checkmark-circle-outline" size={20} color="white" />
            <Text style={styles.paymentButtonText}>
              {t('screens.checkout.finalise')}
            </Text>
          </Pressable>
        )}
      </View>
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setIsModalVisible(false);
        }}
        onShow={() => {
          setTimeout(() => {
            amountInput.current.focus();
          }, 100);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t('screens.checkout.enter_amount_recieved')}
            </Text>
            <TextInput
              style={styles.input}
              inputMode="numeric"
              placeholder="CHF"
              placeholderTextColor={Colors.text}
              value={givenAmount}
              onChangeText={setGivenAmount}
              autoFocus={false}
              ref={amountInput}
            />
            <Pressable
              style={styles.calculateButton}
              onPress={handleCalculateChange}
            >
              <Ionicons name="calculator-outline" size={20} color="white" />
              <Text style={styles.calculateButtonText}>
                {t('screens.checkout.calculate_change')}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background,
  },
  summary: {
    flex: 1,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  productText: {
    fontSize: 16,
    color: Colors.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.tint,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.text,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.text,
    textAlign: 'right',
  },
  changeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#AF6A31',
  },
  changeAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#AF6A31',
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  paymentButton: {
    flex: 1,
    padding: 12,
    margin: 4,
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentButtonInactive: {
    flex: 1,
    padding: 12,
    margin: 4,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishButton: {
    flex: 1,
    padding: 12,
    margin: 4,
    backgroundColor: 'darkgreen',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentButtonText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.text,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width - 40,
    padding: 20,
    backgroundColor: Colors.background,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: 4,
    padding: 8,
    width: '100%',
    marginBottom: 16,
    color: Colors.text,
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: 'darkgreen',
    borderRadius: 4,
  },
  calculateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default CheckoutScreen;
