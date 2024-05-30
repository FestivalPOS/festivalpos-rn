import {
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItemList,
  } from '@react-navigation/drawer';
  import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

  export default function BrandedDrawerContent(
    props: DrawerContentComponentProps & { children?: JSX.Element },
  ) {
    return (
      <DrawerContentScrollView {...props}>
        <View style={styles.container}>
          <Image style={styles.logo} source={require('../assets/logo.png')} />
          {props.children}
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    );
  }
  
  export function BrandedDrawerWithTitle({
    title,
    ...rest
  }: React.ComponentProps<typeof BrandedDrawerContent> & { title: string }) {
    return (
      <BrandedDrawerContent {...rest}>
        <Text style={styles.title}>{title}</Text>
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
      alignItems: 'center'
    },
    logo: {
      width: 180,
      height: 180,
    },
    title: {
      fontSize: 18,
      color: Colors.tint
    },
  });