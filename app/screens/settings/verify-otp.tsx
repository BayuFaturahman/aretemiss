import React, {FC, useCallback, useEffect, useState} from "react"
import {Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  BackNavigation,
  Button, DismissKeyboard,
  Text,
} from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import {VStack} from "@components/view-stack";
import Spacer from "@components/spacer";
import {Colors, Spacing} from "@styles";
import logoBottom from "@assets/icons/ilead_abm.png";
import FastImage from "react-native-fast-image";

import SMSVerifyCode from 'react-native-sms-verifycode'
import {useStores} from "../../bootstrap/context.boostrap";

import Spinner from 'react-native-loading-spinner-overlay';

const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

const MyAccountVerifyOTP: FC<StackScreenProps<NavigatorParamList, "myAccountVerifyOTP">> = observer(
  ({ navigation, route }) => {

    const [otpCode, setOTPCode] = useState<number | null>(null)
    const [isError, setIsError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>('')

    const { newEmail, newNickname, photo } = route.params

    const { authStore, mainStore } = useStores()

    // const goToLogin = () => navigation.navigate("login")

    const verifyNumber = useCallback( async () => {
      mainStore.formReset()
      console.log('verify number for ', otpCode,  authStore.otpHash, mainStore.userProfile.user_email)
      if(authStore.otp === Number(otpCode)){
        console.log('otp match')
      }
      await mainStore.verifyOTP(otpCode ? otpCode.toString() : '', authStore.otpHash, mainStore.userProfile.user_email)
    }, [otpCode])

    const resendOTP = useCallback(async () => {
      await authStore.resendOTP(mainStore.userProfile.user_email)
    }, [])

    const onInputCompleted = (otp) => {
      setOTPCode(otp)
      Keyboard.dismiss()
    }

    useEffect(() => {
      mainStore.formReset()
    }, [])

    useEffect(() => {
      if(otpCode !== null){
        verifyNumber()
      }
    }, [otpCode])

    useEffect(() => {
      console.log('is loading')
      console.log(mainStore.isLoading)
    }, [mainStore.isLoading])

    useEffect(() => {
      console.log('is error')
      if(mainStore.errorMessage !== null){
        setIsError(true)
      }
    }, [mainStore.errorMessage])

    useEffect(() => {
      console.log("otp verified succeed")
      if (mainStore.isOTPVerified) {
        // setIsError(false)
        // goToVerifyOTP()

        goBack()
       
    }}, [mainStore.isOTPVerified])
    

    const goBack = () => {
      navigation.navigate("myAccount", {
        newEmail: newEmail,
        newNickname: newNickname,
        photo: photo
      })
    }

    return (
      // <DismissKeyboard>
        <VStack testID="CoachingJournalMain" style={{backgroundColor: Colors.WHITE, flex: 1, justifyContent: 'center'}}>
          <SafeAreaView style={{flex: 1}}>
            <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={keyboardVerticalOffset} style={{flex: 1}}>
              <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
              <Spacer />
              <VStack top={Spacing[24]} horizontal={Spacing[24]}>
                {/* <Text type={'header'} text="Selamat datang di iLEAD." /> */}
                {/* <Spacer height={Spacing[32]} /> */}

                 <Text type={'warning'} style={{textAlign: 'center'}}>
                   {mainStore.errorMessage}
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
              <VStack top={Spacing[32]} horizontal={Spacing[96]} bottom={Spacing[72]}>
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
              {/* <FastImage style={{
                height: Spacing[72],
                bottom: 0
              }} source={logoBottom} resizeMode={"contain"}/> */}
            </KeyboardAvoidingView>
          </SafeAreaView>
          <Spinner
            visible={authStore.isLoading}
            textContent={'Memuat...'}
            // textStyle={styles.spinnerTextStyle}
          />
        </VStack>
      // {/* </DismissKeyboard> */}
    )
  },
)

export default MyAccountVerifyOTP;
