import React, { FC, useCallback, useEffect, useState} from "react"
import { SafeAreaView, StyleSheet } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  BackNavigation,
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

import {useStores} from "../../bootstrap/context.boostrap";

import Spinner from 'react-native-loading-spinner-overlay';
import {useFocusEffect} from "@react-navigation/native";

const VerifyPhone: FC<StackScreenProps<NavigatorParamList, "verifyPhone">> = observer(
  ({ navigation }) => {

    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const [phoneNumberVerify, setPhoneNumberVerify] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isError, setIsError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>('')

    const {authStore} = useStores()

    const nextScreen = () => navigation.navigate("verifyOTP")
    const goToLogin = () => navigation.navigate("login")

    const submitVerify = useCallback( async() =>{
      authStore.resetLoginState()
      await authStore.signup(phoneNumber, password)
    }, [phoneNumber, phoneNumberVerify, password])

    useEffect(() => {
      authStore.formReset()
      authStore.resetAuthStore()
    }, [])

    // useFocusEffect(useCallback(() => {
    //   authStore.formReset()
    //   authStore.resetAuthStore()
    // }, [authStore.otp, authStore.token, authStore.isLoading]))

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
      console.log('register succeed')
      if(authStore.otp !== null){
        setIsError(false)
        nextScreen()
      }
    }, [authStore.otp])

    const styles = StyleSheet.create({

    })

    const goBack = () => {
      navigation.goBack()
    }

    return (
      <VStack testID="CoachingJournalMain" style={{backgroundColor: Colors.WHITE, flex: 1, justifyContent: 'center'}}>
        {/* <GradientBackground colors={["#422443", "#281b34"]} /> */}
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
              // value={'089123123123'}
              // label="No. HP:"
              label="Alamat E-mail:"
              style={{ paddingTop: 0}}
              isError={isError && (authStore.errorCode === 1 || authStore.errorCode === 10 || authStore.errorCode === 14)}
              onChangeText={setPhoneNumber}
            />
            <TextField
              // value={'089123123123'}
              label="Masukan kembali alamat E-mail:"
              style={{ paddingTop: 0}}
              isError={isError && (authStore.errorCode === 1 || authStore.errorCode === 10 || authStore.errorCode === 14)}
              onChangeText={setPhoneNumberVerify}
            />
            <TextField
              // value={'089123123123'}
              label="Password baru:"
              style={{ paddingTop: 0}}
              secureTextEntry={true}
              isError={isError && (authStore.errorCode === 3 || authStore.errorCode === 15 || authStore.errorCode === 10)}
              onChangeText={setPassword}
            />
          </VStack>
          <VStack top={Spacing[32]} horizontal={Spacing[96]}>
            <Button
              type={"primary"}
              // text={"Kirim SMS verifikasi"}
              text={"Kirim verifikasi"}
              onPress={submitVerify}
            />
            <Spacer height={Spacing[8]} />
            <Button
              type={"secondary"}
              text={"Login"}
              onPress={goToLogin}
            />
          </VStack>
          <Spacer />
          <FastImage style={{
            height: Spacing[96],
            marginLeft: Spacing[48],
            bottom: 0
          }} source={logoBottom} resizeMode={"contain"}/>
        </SafeAreaView>
        <Spinner
            visible={authStore.isLoading}
            textContent={'Memuat...'}
            // textStyle={styles.spinnerTextStyle}
          />
      </VStack>
    )
  },
)

export default VerifyPhone;
