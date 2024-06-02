import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { getTabBarIcon } from '../helpers/icons';
import { usePOS } from '../contexts/POS.context';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/Cart.context';

export default function BrandedDrawerContent(
  props: DrawerContentComponentProps & { children?: JSX.Element } & {
    showLogoutButton?: boolean;
  },
) {
  const { logoutPOS } = usePOS();
  const { resetCart } = useCart();
  const { t } = useTranslation();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.container}>
        <Image style={styles.logo} source={require('../assets/logo.png')} />
        {props.children}
      </View>
      <DrawerItemList {...props} />
      {props.showLogoutButton && (
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <DrawerItem
            label={t('nav.logout')}
            onPress={() => {
              logoutPOS();
              resetCart();
              props.navigation.navigate('home', { screen: 'welcome' });
            }}
            icon={getTabBarIcon({ name: 'log-out-outline' })}
            inactiveBackgroundColor="#301515"
          />
        </View>
      )}
    </DrawerContentScrollView>
  );
}

export function BrandedDrawerWithTitle({
  title,
  ...rest
}: React.ComponentProps<typeof BrandedDrawerContent> & { title: string }) {
  return (
    <BrandedDrawerContent {...rest}>
      <View style={styles.titleBox}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </BrandedDrawerContent>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
    overflow: 'hidden',
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
  },
  titleBox: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    color: Colors.tint,
    fontWeight: 'bold',
  },
});
