import React, {FC, useCallback, useEffect, useState} from "react"
import {Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  BackNavigation,
  Button, DismissKeyboard,
  Text,
} from "@components"
import { NavigatorParamList } from "@navigators/auth-navigator"
import {VStack} from "@components/view-stack";
import Spacer from "@components/spacer";
import {Colors, Spacing} from "@styles";
import logoBottom from "@assets/icons/ilead-bottom-logo.png";
import FastImage from "react-native-fast-image";

import SMSVerifyCode from 'react-native-sms-verifycode'
import {useStores} from "../../bootstrap/context.boostrap";

import Spinner from 'react-native-loading-spinner-overlay';

const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

const VerifyOTP: FC<StackScreenProps<NavigatorParamList, "verifyOTP">> = observer(
  ({ navigation }) => {

    const [otpCode, setOTPCode] = useState<number | null>(null)
    const [isError, setIsError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>('')

    const { authStore, mainStore } = useStores()

    const goToLogin = () => navigation.navigate("login")

    const verifyNumber = useCallback( async () => {
      console.log('verify number')
      if(authStore.otp === Number(otpCode)){
        console.log('otp match')
      }
      if(authStore.isLoginFlow) {
        await authStore.loginVerify(otpCode ? otpCode.toString() : '')
        // await mainStore.setProfile()
      } else {
        await authStore.signupVerify(otpCode ? otpCode.toString() : '')
      }
    }, [otpCode])

    const resendOTP = useCallback(async () => {
      await authStore.resendOTP(authStore.email)
    }, [])

    const onInputCompleted = (otp) => {
      setOTPCode(otp)
      Keyboard.dismiss()
    }

    useEffect(() => {
      authStore.formReset()
    }, [])

    useEffect(() => {
      if(otpCode !== null){
        verifyNumber()
      }
    }, [otpCode])

    useEffect(() => {
      console.log('is loading')
      console.log(authStore.isLoading)
    }, [authStore.isLoading])

    useEffect(() => {
      console.log('is error')
      if(authStore.errorMessage !== null){
        setIsError(true)
      }
    }, [authStore.errorMessage])

    useEffect(() => {
      console.log('succeed')
      if(authStore.isCreateProfile === true){
        setIsError(false)
        navigation.navigate("createProfile")
      }
    }, [authStore.isCreateProfile])

    // useEffect(() => {
    //   if(authStore.){
    //     // console.log(authStore.formErrorCode)
    //     setIsError(true)
    //     setErrorMessage(errorCollection.find(i => i.errorCode === authStore.formErrorCode).message)
    //   }else{
    //     setIsError(false)
    //   }
    // }, [authStore.formErrorCode, authStore.login, isError])

    const styles = StyleSheet.create({

    })

    const goBack = () => {
      navigation.goBack()
    }

    return (
      <DismissKeyboard>
        <VStack testID="CoachingJournalMain" style={{backgroundColor: Colors.WHITE, flex: 1, justifyContent: 'center'}}>
          <SafeAreaView style={{flex: 1}}>
            <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={keyboardVerticalOffset} style={{flex: 1}}>
              <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
              <Spacer />
              <VStack top={Spacing[24]} horizontal={Spacing[24]}>
                <Text type={'header'} text="Selamat datang di iLEAD." />
                <Spacer height={Spacing[32]} />

                 <Text type={'warning'} style={{textAlign: 'center'}}>
                   {authStore.errorMessage}
                 </Text>

                { __DEV__ === true ?  <Text type={'body'} style={{textAlign: 'center'}}>{authStore.otp}</Text> : null}

                <Spacer height={Spacing[12]} />
              </VStack>
              <VStack>
                <Text type={'header2'} text="Masukan 4 digit nomor dari email verifikasi:" style={{textAlign:'center'}} />
                <Spacer height={Spacing[16]} />
                <SMSVerifyCode
                  verifyCodeLength={4}
                  containerPaddingHorizontal={Spacing[128]}
                  codeViewStyle={{borderWidth: Spacing[2], borderRadius:Spacing[20], minWidth: Spacing[64], minHeight: Spacing[96]}}
                  codeFontSize={Spacing[72]}
                  containerStyle={{justifyContent:'center'}}
                  codeViewBorderColor={Colors.UNDERTONE_BLUE}
                  onInputCompleted={onInputCompleted}
                />
              </VStack>
              <VStack top={Spacing[32]} horizontal={Spacing[96]}>
                <Button
                  type={"primary"}
                  text={"Verifikasi E-mail ini"}
                  onPress={verifyNumber}
                />
                <Spacer height={Spacing[8]} />
                <Button
                  type={"secondary"}
                  text={"Kirim ulang E-mail verifikasi "}
                  onPress={resendOTP}
                />
              </VStack>
              <Spacer />
              <FastImage style={{
                height: Spacing[96],
                marginLeft: Spacing[48],
                bottom: 0
              }} source={logoBottom} resizeMode={"contain"}/>
            </KeyboardAvoidingView>
          </SafeAreaView>
          <Spinner
            visible={authStore.isLoading}
            textContent={'Memuat...'}
            // textStyle={styles.spinnerTextStyle}
          />
        </VStack>
      </DismissKeyboard>
    )
  },
)

export default VerifyOTP;
