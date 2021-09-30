import React, {FC, useCallback, useEffect, useState} from "react"
import { SafeAreaView } from "react-native"
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
import {useStores} from "@models";
import {errorCollection} from "@utils/form-error-type";


const LoginScreen: FC<StackScreenProps<NavigatorParamList, "login">> = observer(
  ({ navigation }) => {

    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isError, setIsError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>('')

    const { authStore } = useStores()

    const goToForgotPassword = () => navigation.navigate("forgotPassword")

    const nextScreen = () => navigation.navigate("verifyOTP")

    const submitLogin = useCallback( ()=>{
      setIsError(false)
      authStore.login(phoneNumber , password)
    }, [phoneNumber, password])

    useEffect(() => {
      // authStore.resetAuthStore()
    }, [])

    useEffect(() => {
      console.log(authStore.authUser.otp)
      if(authStore.authUser.otp){
        nextScreen()
      }
    }, [authStore.authUser.otp])

    useEffect(() => {
      console.log('is loading'+ authStore.isLoading)
    }, [authStore.isLoading])

    useEffect(() => {
      if(authStore.formErrorCode){
        console.log('ada error')
        console.log(isError)
        console.log(authStore.formErrorCode)
        setIsError(true)
        setErrorMessage(errorCollection.find(i => i.errorCode === authStore.formErrorCode).message)
      }else{
        setIsError(false)
      }
    }, [authStore.formErrorCode, authStore.login, isError])

    const logout = useCallback( ()=>{
      authStore.resetAuthStore()
    }, [])

    return (
      <VStack testID="CoachingJournalMain" style={{backgroundColor: Colors.WHITE, flex: 1, justifyContent: 'center'}}>
        <SafeAreaView style={{flex: 1}}>
          <Spacer />
          <VStack top={Spacing[24]} horizontal={Spacing[24]}>
            <Text type={'header'} text="Selamat datang di iLEAD." />
            <Spacer height={Spacing[24]} />
            <Text type={'warning'} style={{textAlign: 'center'}}>
              {/* Waduh. Nomor verifikasi yang kamu masukan salah. */}
              {/* Coba cek kembali nomor hapemu dan kirim ulang nomor verifikasinya! */}
              {errorMessage}
            </Text>
            <Spacer height={Spacing[32]} />
            <TextField
              value={phoneNumber}
              label="Masukan no. HP yang sudah diregistrasi:"
              style={{ paddingTop: 0}}
              isError={isError && (authStore.formErrorCode === 2 || authStore.formErrorCode === 1 || authStore.formErrorCode === 10 || authStore.formErrorCode === 15)}
              onChangeText={setPhoneNumber}
              keyboardType={'numeric'}
            />
            <TextField
              value={password}
              label="Password"
              style={{ paddingTop: 0}}
              secureTextEntry={true}
              isError={isError && (authStore.formErrorCode === 3 || authStore.formErrorCode === 15)}
              onChangeText={setPassword}
            />
          </VStack>
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
              onPress={logout}
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
