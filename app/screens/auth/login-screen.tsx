import React, { FC } from "react"
import { SafeAreaView, StyleSheet } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  Button,
  Text,
  TextField,
} from "@components"
import { NavigatorParamList } from "@navigators/auth-navigator"
import {VStack} from "@components/view-stack";
import Spacer from "@components/spacer";
import {Colors, Spacing} from "@styles";
import logoBottom from "@assets/icons/ilead-bottom-logo.png";
import FastImage from "react-native-fast-image";

const LoginScreen: FC<StackScreenProps<NavigatorParamList, "login">> = observer(
  ({ navigation }) => {
    const nextScreen = () => navigation.navigate("verifyPhone")

    const goToForgotPassword = () => navigation.navigate("forgotPassword")

    const styles = StyleSheet.create({

    })

    return (
      <VStack testID="CoachingJournalMain" style={{backgroundColor: Colors.WHITE, flex: 1, justifyContent: 'center'}}>
        {/* <GradientBackground colors={["#422443", "#281b34"]} /> */}
        <SafeAreaView style={{flex: 1}}>
          <Spacer />
          <VStack top={Spacing[24]} horizontal={Spacing[24]}>
            <Text type={'header'} text="Selamat datang di iLEAD." />
            <Spacer height={Spacing[24]} />
            <Text type={'warning'} style={{textAlign: 'center'}}>
              Waduh. Nomor verifikasi yang kamu masukan salah.
              Coba cek kembali nomor hapemu dan kirim ulang nomor verifikasinya!
            </Text>
            <Spacer height={Spacing[32]} />
            <TextField
              // value={'089123123123'}
              label="Masukan no. HP yang sudah diregistrasi:"
              style={{ paddingTop: 0}}
              isError={true}
            />
            <TextField
              // value={'089123123123'}
              label="Password"
              style={{ paddingTop: 0}}
              secureTextEntry={true}
            />
          </VStack>
          <VStack top={Spacing[32]} horizontal={Spacing[96]}>
            <Button
              type={"primary"}
              text={"Login"}
              onPress={nextScreen}
            />
            <Spacer height={Spacing[16]} />
            <Button
              type={"secondary"}
              // style={CONTINUE}
              text={"Lupa Password"}
              onPress={goToForgotPassword}
            />
          </VStack>
          <Spacer />
          <FastImage style={{
            height: Spacing[96],
            marginLeft: Spacing[48],
            bottom: 0
          }} source={logoBottom} resizeMode={"contain"}/>
        </SafeAreaView>
      </VStack>
    )
  },
)

export default LoginScreen;
