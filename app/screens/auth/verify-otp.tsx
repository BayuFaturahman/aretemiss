import React, { FC } from "react"
import {Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  Button,
  Text,
} from "@components"
import { NavigatorParamList } from "@navigators/auth-navigator"
import {VStack} from "@components/view-stack";
import Spacer from "@components/spacer";
import {Colors, Spacing} from "@styles";
import logoBottom from "@assets/icons/ilead-bottom-logo.png";
import FastImage from "react-native-fast-image";

import SMSVerifyCode from 'react-native-sms-verifycode'

const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

const VerifyOTP: FC<StackScreenProps<NavigatorParamList, "verifyOTP">> = observer(
  ({ navigation }) => {
    const verifyNumber = () => {
      navigation.navigate("verifyPhone")
      Keyboard.dismiss()
    }
    const goToLogin = () => navigation.navigate("login")

    const onInputCompleted = () => {
      Keyboard.dismiss()
    }

    const styles = StyleSheet.create({

    })

    return (
      <VStack testID="LoginScreen" style={{backgroundColor: Colors.WHITE, flex: 1, justifyContent: 'center'}}>
        {/* <GradientBackground colors={["#422443", "#281b34"]} /> */}
        <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={keyboardVerticalOffset} style={{flex: 1}}>
          <Spacer />
          <VStack top={Spacing[24]} horizontal={Spacing[24]}>
            <Text type={'header'} text="Selamat datang di iLEAD." />
            <Spacer height={Spacing[32]} />

             <Text type={'body'} style={{textAlign: 'center'}}>
               Berhasil! Kami sudah mengirimkan 4 digit nomor verifikasi melalui SMS ke nomor hapemu.
             </Text>

            <Spacer height={Spacing[12]} />
          </VStack>
          <VStack>
            <Text type={'header2'} text="Masukan 4 digit nomor dari sms verifikasi:" style={{textAlign:'center'}} />
            <Spacer height={Spacing[16]} />
            <SMSVerifyCode
              verifyCodeLength={4}
              // containerPaddingVertical={Spacing[8]}
              containerPaddingHorizontal={Spacing[128]}
              codeViewStyle={{borderWidth: Spacing[2], borderRadius:Spacing[20], minWidth: Spacing[64], minHeight: Spacing[96]}}
              codeFontSize={Spacing[72]}
              // containerBackgroundColor={'red'}
              containerStyle={{justifyContent:'center'}}
              codeViewBorderColor={Colors.UNDERTONE_BLUE}
              onInputCompleted={onInputCompleted}
            />
          </VStack>
          <VStack top={Spacing[32]} horizontal={Spacing[96]}>
            <Button
              type={"primary"}
              text={"Verifikasi nomor ini"}
              onPress={verifyNumber}
            />
            <Spacer height={Spacing[8]} />
            <Button
              type={"secondary"}
              text={"Kirim ulang SMS verifikasi "}
              onPress={goToLogin}
            />
          </VStack>
          <Spacer />
          <FastImage style={{
            height: Spacing[96],
            marginLeft: Spacing[48],
            bottom: 0
          }} source={logoBottom} resizeMode={"contain"}/>
        </KeyboardAvoidingView>
      </VStack>
    )
  },
)

export default VerifyOTP;
