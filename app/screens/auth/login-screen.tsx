import React, {FC, useCallback, useEffect, useState} from "react"
import {SafeAreaView, ScrollView} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  BackNavigation,
  Button, DismissKeyboard,
  Text,
  TextField,
} from "@components"
import { NavigatorParamList } from "@navigators/auth-navigator"
import {VStack} from "@components/view-stack";
import Spacer from "@components/spacer";
import {Colors, Layout, Spacing} from "@styles";

import {useStores} from "../../bootstrap/context.boostrap";

import Spinner from 'react-native-loading-spinner-overlay';
import messaging from "@react-native-firebase/messaging";
import {IleadLogo} from "@assets/svgs";
import {dimensions} from "@config/platform.config";


const LoginScreen: FC<StackScreenProps<NavigatorParamList, "login">> = observer(
  ({ navigation }) => {

    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isError, setIsError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>('')

    const { authStore, mainStore } = useStores()

    const goToForgotPassword = () => navigation.navigate("forgotPassword")

    const goToVerifyOTP = () => navigation.navigate("verifyOTP")

    const submitLogin = useCallback( async()=>{

      const token = await messaging().getToken();

      console.log('### FCM token login ###')
      console.log(token)

      await authStore.login(phoneNumber , password, token)
    }, [phoneNumber, password])

    useEffect(() => {
      authStore.formReset()
      authStore.resetAuthStore()
      console.log('use effect [] login')
    }, [])

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

    // useEffect(() => {
    //   console.log('login succeed')
    //   if(authStore.otp !== null){
    //     setIsError(false)
    //     goToVerifyOTP()
    //   }
    // }, [authStore.otp])

    useEffect(() => {
      if(authStore.isCreateProfile){
        setIsError(false)
        getUserProfile()
        console.log('isCreateProfile is true')


        if (!authStore.isVerify ) {
          resendOTP()

          console.log('in login screen, resendOTP')
          if(authStore.otp !== null){
            setIsError(false)
            goToVerifyOTP()
          }
          
        } 

        if (authStore.isVerify && authStore.needUpdateProfile) {
          navigation.navigate("createProfile", {
            isFromVerifyOtp: false
          })
          
        }
      }

      // console.log('succeed')
     
    }, [ authStore.isCreateProfile, authStore.token, authStore.isVerify, authStore.needUpdateProfile, authStore.otp])

    const resendOTP = useCallback(async () => {
      await authStore.resendOTP(authStore.email)
    }, [])

    const getUserProfile = useCallback(async ()=>{
      await mainStore.getProfile()
    }, [])

    // useEffect(() => {
    //   // authStore.resetAuthStore()
    // }, [])
    //
    // useEffect(() => {
    //   console.log(authStore.authUser.otp)
    //   if(authStore.authUser.otp){
    //     nextScreen()
    //   }
    // }, [authStore.authUser.otp])
    //
    // useEffect(() => {
    //   console.log('is loading'+ authStore.isLoading)
    // }, [authStore.isLoading])
    //
    // useEffect(() => {
    //   if(authStore.formErrorCode){
    //     console.log('ada error')
    //     console.log(isError)
    //     console.log(authStore.formErrorCode)
    //     setIsError(true)
    //     setErrorMessage(errorCollection.find(i => i.errorCode === authStore.formErrorCode).message)
    //   }else{
    //     setIsError(false)
    //   }
    // }, [authStore.formErrorCode, authStore.login, isError])

    const logout = useCallback( ()=>{
      // authStore.resetAuthStore()
    }, [])

    const goBack = () => {
      navigation.goBack()
      // authStore.resetAuthStore()
    }

    return (
      <DismissKeyboard>
        <VStack testID="CoachingJournalMain" style={{backgroundColor: Colors.WHITE, flex: 1, justifyContent: 'center'}}>
          <ScrollView bounces={false} style={[Layout.flex, Layout.heightFull]}>
          <SafeAreaView style={{flex: 1}}>
            <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
            <Spacer />
            <VStack top={Spacing[24]} horizontal={Spacing[24]}>
              <Text type={'header'} text="Selamat datang di iLEAD." />
              <Spacer height={Spacing[24]} />
              <Text type={'warning'} style={{textAlign: 'center'}}>
                {authStore.errorMessage}
              </Text>
              <Spacer height={Spacing[32]} />
              <TextField
                value={phoneNumber}
                label="Masukan E-mail yang sudah diregistrasi:"
                style={{ paddingTop: 0}}
                isError={isError && (authStore.errorCode === 2 || authStore.errorCode === 1 || authStore.errorCode === 10 || authStore.errorCode === 14)}
                onChangeText={setPhoneNumber}
              />
              <TextField
                value={password}
                label="Password"
                style={{ paddingTop: 0}}
                secureTextEntry={true}
                isError={isError && (authStore.errorCode === 3 || authStore.errorCode === 15 || authStore.errorCode === 10)}
                onChangeText={setPassword}
              />
            </VStack>
            <Spacer height={Spacing[48]} />
            <VStack top={Spacing[32]} horizontal={Spacing[96]}>
              <Button
                type={"primary"}
                text={"Login"}
                onPress={submitLogin}
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
            <IleadLogo height={Spacing[72]} width={dimensions.screenWidth} />
            <Spacer height={Spacing[24]} />
          </SafeAreaView>
          </ScrollView>
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

export default LoginScreen;
