import React, { FC, useCallback, useEffect, useState, createRef } from "react"
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {Text, BackNavigation, Button, TextField, DismissKeyboard} from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"

import { Formik } from "formik"
import { useStores } from "../../bootstrap/context.boostrap"
import FastImage from "react-native-fast-image"
import nullProfileIcon from "@assets/icons/settings/null-profile-picture.png"
import { dimensions } from "@config/platform.config"
import Modal from "react-native-modalbox"
import Spinner from 'react-native-loading-spinner-overlay';

import {launchImageLibrary, launchCamera, ImagePickerResponse, } from 'react-native-image-picker';

import ActionSheet from "react-native-actions-sheet";
import { MoodComponent } from "@screens/homepage/components/mood-component"
import { USER_POSITION } from "./change-user-position"

export type ProfileUpdateForm = {
  fullname: string
  nickname: string
  email: string
  team1Id: string
  team2Id: string
  team3Id: string
  team1Name: string
  team2Name: string
  team3Name: string
  photo: string
  isAllowNotification?: number
  isAllowReminderNotification?: number
  mood: string
  userPosition: string
}

const qualityImage = Platform.OS === 'ios' ? 0.4 : 0.5;
const maxWidthImage = 1024;
const maxHeightImage = 1024;

const MyAccount: FC<StackScreenProps<NavigatorParamList, "myAccount">> = observer(
  ({ navigation, route }) => {
    const { authStore, mainStore } = useStores()

    const [isModalVisible, setModalVisible] = useState<boolean>(false)
    const [modalTitle, setModalTitle] = useState<string>('')
    const [modalDesc, setModalDesc] = useState<string>('')
    const [modalIcon, setModalIcon] = useState('senang')

    const [isEmailValid, setIsEmailValid] = useState<boolean>(false)
    const [emailErrorMessage, setEmailErrorMessage] = useState<string>('')
    const [generalErrorMessage, setGeneralErrorMessage] = useState<string>('')
    const [isDisableEditBtn, setIsDisableEditBtn] = useState(true)

    const userProfile: ProfileUpdateForm = {
      fullname: mainStore.userProfile.user_fullname,
      nickname: mainStore.userProfile.user_nickname,
      email: mainStore.userProfile.user_email,
      team1Id: mainStore.userProfile.team1_id,
      team2Id: mainStore.userProfile.team2_id,
      team3Id: mainStore.userProfile.team3_id,
      team1Name: mainStore.userProfile.team1_name,
      team2Name: mainStore.userProfile.team2_name,
      team3Name: mainStore.userProfile.team3_name,
      photo: mainStore.userProfile.user_photo,
      isAllowNotification: mainStore.userProfile.user_is_allow_notification,
      isAllowReminderNotification: mainStore.userProfile.user_is_allow_reminder_notification,
      mood: mainStore.userProfile.user_mood,
      userPosition: mainStore.userProfile.user_position? USER_POSITION.filter((position) => position.id === mainStore.userProfile.user_position).length > 0 ? USER_POSITION.filter((position) => position.id === mainStore.userProfile.user_position)[0].item : '' : '',
    }


    console.log('mainStore.userProfile USer profile: ', mainStore.userProfile)
    console.log('USer profile: ', userProfile)
    const actionSheetRef = createRef();

    const [profilePicture, setProfilePicture] = useState(userProfile.photo)

    const goBack = () => navigation.goBack()

    const goToChangePassword = () => navigation.navigate("changePassword")

    const goToChangeDivision = () => navigation.navigate("changeDivision")
    
    const goToChangePosition = () => navigation.navigate("changeUserPosition", {
      isFromSetting: true
    })

    const goToVerifyOTP = (email, nickname, profile) => navigation.navigate("myAccountVerifyOTP", {
      newEmail: email,
      newNickname: nickname,
      photo: profile || ''
    })

    const validateEmail = (email) => {
      const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
      if (reg.test(email) === false) {
        console.log("Email is Not Correct")
        setEmailErrorMessage('Alamat email yang kamu ganti formatnya salah. Pastikan alamat emailnya sudah kamu tulis dengan benar ya!')
        setIsEmailValid(false)
        return false
      } else {
        setIsEmailValid(true)
        console.log("Email Correct")
        return true
      }
    }

    const checkDataChange = useCallback((oldData, newData) => {
      return (oldData.toLowerCase().trim() !== newData.toLowerCase().trim())
    }, [userProfile])

    const onClickEditProfile = useCallback(async (data: ProfileUpdateForm) => {
      // console.log("click : ", data)
      navigation.setParams({ isPasswordChange: undefined })

      mainStore.setIsOTPVerified(false)
      mainStore.formReset();
      // setIsClickEditProfile(true)
      const isEmailChange = checkDataChange(userProfile.email, data.email)
      // const isNicknameChange = checkDataChange(userProfile.nickname, data.nickname)

      console.log('Email change? ', isEmailChange, ' old email: ', userProfile.email, ' new email: ', data.email)
      console.log('foto change? ', userProfile.photo , ' new photo: ', data.photo)
      // if (isEmailChange || isNicknameChange) {
        if (isEmailChange) {
          if (validateEmail(data.email)) {
            console.log("go to otp")
            await mainStore.resendOTP(userProfile.email, data.email)
            if (authStore.otp !== null) {
              // setIsError(false)
              goToVerifyOTP(data.email, data.nickname, data.photo )
            }
          }
        } else {
          userProfile.email = data.email
          userProfile.nickname = data.nickname
          userProfile.photo = data.photo

          console.log('onClickEditProfile')
          const isEmailValid = validateEmail(data.email)
          console.log(userProfile)
          console.log("Data to be submitted", userProfile)
          if(isEmailValid) {
            await mainStore.updateProfile(mainStore.userProfile.user_id, userProfile)
            if (mainStore.errorCode === null) {
              setIsDisableEditBtn(true);
              setModalContent('Hore!', 'Profil kamu sudah berhasil diganti.', 'senang')
              
              await mainStore.getProfile();
              toggleModal()
            } else {
              setModalContent('Oh no! :(', 'Perubahannya gagal diproses.\nCoba lagi ya!', 'marah')

              console.log('error code ', mainStore.errorCode)
              if (mainStore.errorCode === 500) {
                setGeneralErrorMessage(mainStore.errorMessage)
              } else {
                setIsEmailValid(false)
                setEmailErrorMessage(mainStore.errorMessage)
                setGeneralErrorMessage(null)
              }
              
              toggleModal()
            }
          }
        }

    }, [userProfile, profilePicture, mainStore.errorCode, isDisableEditBtn, mainStore.updateProfileSuccess, mainStore.updateProfileFailed, modalTitle, modalDesc, modalIcon])

    const submitEditProfile = useCallback(async (data: ProfileUpdateForm) => {
      console.log("submitEditProfile Data to be submitted", userProfile)
      await mainStore.updateProfile(mainStore.userProfile.user_id, userProfile)
      if (mainStore.errorCode === null) {
        setModalContent('Hore!', 'Profil kamu sudah berhasil diganti.', 'senang')
        setIsDisableEditBtn(true);
        await mainStore.getProfile();
        // console.log('USER PROFILE ', userProfile)
        toggleModal()

      }
      else {
        setIsEmailValid(false)
        setEmailErrorMessage(mainStore.errorMessage)
      }
    }, [mainStore.errorCode, userProfile, isDisableEditBtn])

    const setModalContent = (title: string, desc: string, icon:string) => {
      setModalTitle(title)
      setModalDesc(desc)
      setModalIcon(icon)
    }

    useEffect(() => {
      if (mainStore.isOTPVerified && route.params?.newEmail && route.params?.newNickname ) {
        const { newEmail, newNickname, photo } = route.params

        userProfile.email = newEmail
        userProfile.nickname = newNickname
        userProfile.photo = photo

        submitEditProfile(userProfile);
      } else {
        console.log('OTP NOT verified')
      }
    }, [mainStore.isOTPVerified, route.params?.newNickname, route.params?.newEmail, route.params?.photo])

    useEffect(() => {
      if (route.params?.isPasswordChange) {
        setModalContent('Hore!', 'Password kamu sudah berhasil diganti.', 'senang')
        toggleModal()
      }
    }, [route.params?.isPasswordChange])

    const handleValueChanges = useCallback(async (data: ProfileUpdateForm) => {
      // console.log('setIsDisableEditBtn to true 189')
      setIsDisableEditBtn(true)

      const isEmailChange = checkDataChange(userProfile.email, data.email)
      const isNicknameChange = checkDataChange(userProfile.nickname, data.nickname)

      if (isEmailChange || isNicknameChange) {
        // console.log('setIsDisableEditBtn to false 196')
        setIsDisableEditBtn(false)
      }

      if (isEmailChange) {
        const isEmailValid = validateEmail(data.email)
        console.log('Email valid? ', isEmailValid)
        if (isEmailValid) {
          mainStore.formReset();
          await mainStore.checkEmail(data.email)
          if (mainStore.errorCode !== null) {
            setIsEmailValid(false)
            setEmailErrorMessage(mainStore.errorMessage)
            // console.log('setIsDisableEditBtn to true 209')
            setIsDisableEditBtn(true)
          } else {
            // console.log('setIsDisableEditBtn to false 212')
            setIsDisableEditBtn(false)
          }
        } else {
          // console.log('setIsDisableEditBtn to true 216')
          setIsDisableEditBtn(true)
        }

      }

    }, [isDisableEditBtn, userProfile, mainStore.errorCode, emailErrorMessage, isEmailValid])

    useEffect(() => {
      const isProfileChange = checkDataChange(userProfile.photo, (profilePicture === null) ? "": profilePicture)
      console.log('profilePicture ', profilePicture);
      console.log('userProfile.photo ', userProfile.photo);
      if (isProfileChange) {
        // console.log('setIsDisableEditBtn to false 227')
        setIsDisableEditBtn(false)
      }
    },[profilePicture, isDisableEditBtn])

    useEffect(() => {
      validateEmail(userProfile.email)
      mainStore.formReset()
      authStore.otp = null
    }, [])

    const ChangeProfilePicture = ({ isError = false, onPictureChange }) => {

      const cameraHandler = useCallback(async (response: ImagePickerResponse) => {
        if (!response.didCancel) {

          const formData = new FormData()
          // formData.append('files', response.assets[0].base64 )
          formData.append('files', {
            ...response.assets[0],
            // @ts-ignore
            uri: Platform.OS === 'android'
              ? response.assets[0].uri
              : response.assets[0].uri.replace('file://', ''),
            name: `profile-image-${
              response.assets[0].fileName.toLowerCase().split(' ')[0]
            }-${new Date().getTime()}.jpeg`,
            type: response.assets[0].type ?? 'image/jpeg',
            size: response.assets[0].fileSize,
          } )

          await mainStore.uploadPhoto(formData)

          if (mainStore.errorCode === null){
            console.log('upload photo OK.')
            console.log(mainStore.newProfilePhoto)
            setProfilePicture(response.assets[0].uri)
            onPictureChange(mainStore.newProfilePhoto)
          }

        } else {
          console.log('cancel')
        }
        actionSheetRef.current?.setModalVisible(false);
      }, []);

      const openGallery = useCallback(() => {
        launchImageLibrary({mediaType: 'photo', quality: qualityImage, maxWidth: maxWidthImage, maxHeight: maxHeightImage, includeBase64: false, selectionLimit: 1}, cameraHandler);
      }, []);

      const openCamera = useCallback(() => {
        launchCamera({mediaType: 'photo', quality: qualityImage, maxWidth: maxWidthImage, maxHeight: maxHeightImage, includeBase64: false}, cameraHandler);
      }, []);

      const LABEL_STYLE = {
        color: isError ? Colors.MAIN_RED : Colors.UNDERTONE_BLUE,
      }

      return (
        <VStack horizontal={Spacing[12]}>
          <HStack style={{ alignItems: "center", justifyContent: "space-around" }}>
            <VStack style={{}}>
              <HStack bottom={Spacing[8]}>
                <Text
                  type={"label"}
                  style={[{ fontSize: Spacing[14] }, LABEL_STYLE]}
                  text={"Foto profil"}
                />
              </HStack>
              <FastImage
                style={{ height: Spacing[128], width: Spacing[128], borderRadius: Spacing[24] }}
                source={profilePicture !== '' ? {
                  uri: profilePicture
                }: nullProfileIcon }
                resizeMode={"cover"}
              />
            </VStack>
            <VStack style={{ width: Spacing[128] }} top={Spacing[20]}>
             <Button onPress={()=>{
               actionSheetRef.current?.setModalVisible(true);
             }} type={"primary"} text={"Ganti Foto"} />
            </VStack>
          </HStack>
          <ActionSheet ref={actionSheetRef}>
            <VStack style={{ justifyContent: 'center' }} vertical={Spacing[24]} horizontal={Spacing[24]}>
              <Button onPress={()=>{
                openGallery()
              }} type={"primary"} text={"Galeri Foto 🖼️"} />
              <Spacer height={Spacing[12]} />
               <Button onPress={()=>{
                 openCamera()
               }} type={"primary"} text={"Kamera 📸"} />
            </VStack>
          </ActionSheet>
        </VStack>
      )
    }

    const toggleModal = () => {
      console.log('modal title ', modalTitle )
      console.log('modal desc ', modalDesc )
      setTimeout(() => {
        setModalVisible(!isModalVisible)
        // setIsClickEditProfile(false)
      }, 100)
    }

    return (
      <>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={Layout.flex}
        >
          <VStack
            testID="CoachingJournalMain"
            style={{ backgroundColor: Colors.ABM_BG_BLUE, flex: 1, justifyContent: "center" }}
          >
            <SafeAreaView style={Layout.flex}>
              <BackNavigation goBack={goBack} color={Colors.ABM_DARK_BLUE} />
              <ScrollView>
                <Formik initialValues={userProfile} onSubmit={onClickEditProfile}>
                  {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                    // <View>
                    <>
                      <VStack top={Spacing[8]} horizontal={Spacing[24]} bottom={Spacing[12]}>
                        <Spacer height={Spacing[24]} />
                        <Text
                          type={"header"}
                          style={{ fontSize: Spacing[16] }}
                          text="My Account"
                        />
                        <Spacer height={Spacing[32]} />
                      </VStack>
                      <VStack
                        top={Spacing[32]}
                        horizontal={Spacing[24]}
                        style={[
                          Layout.heightFull,
                          {
                            backgroundColor: Colors.WHITE,
                            borderTopStartRadius: Spacing[48],
                            borderTopEndRadius: Spacing[48],
                          },
                        ]}
                      >
                        <VStack top={Spacing[24]}>
                          <ChangeProfilePicture
                            onPictureChange={(photoUrl)=> {
                            setFieldValue('photo', photoUrl)
                          }} />
                          <Spacer height={Spacing[32]} />
                          <TextField
                            // value={phoneNumber}
                            label="Nama panggilan:"
                            isRequired={false}
                            style={{ paddingTop: 0 }}
                            // isError={isError && (authStore.formErrorCode === 2 || authStore.formErrorCode === 1 || authStore.formErrorCode === 10 || authStore.formErrorCode === 15)}
                            value={values.nickname}
                            onChangeText={handleChange("nickname")}
                            onBlur={() => {handleValueChanges(values)}}
                          />
                          <TextField
                            // value={password}
                            label="Alamat e-mail:"
                            style={{ paddingTop: 0 }}
                            isRequired={false}
                            secureTextEntry={false}
                            onBlur={() => {handleValueChanges(values)}}
                            isError={!isEmailValid || (mainStore.errorCode === 35)}
                            value={values.email}
                            onChangeText={handleChange("email")}
                            // isError={isError && (authStore.formErrorCode === 3 || authStore.formErrorCode === 15)}
                            // onChangeText={setPassword}
                          />
                          {!isEmailValid && (
                            <Text type={"warning"} style={{ textAlign: "center" }}>
                              {emailErrorMessage}
                            </Text>
                          )}
                          <Spacer height={Spacing[12]} />
                          <TextField
                            // value={password}
                            label="Password:"
                            style={{ paddingTop: 0 }}
                            isRequired={false}
                            secureTextEntry={false}
                            changeButton={true}
                            editable={false}
                            value={"******"}
                            onPressChangeButton={goToChangePassword}
                          />
                           {generalErrorMessage !== null && (
                            <Text type={"warning"} style={{ textAlign: "center" }}>
                              {generalErrorMessage}
                            </Text>
                          )}
                          <TextField
                            // value={password}
                            label="Team:"
                            style={{ paddingTop: 0}}
                            inputStyle={{textAlign: 'left', paddingLeft: Spacing[12], paddingVertical: Spacing[4]}}
                            isRequired={false}
                            secureTextEntry={false}
                            isTextArea={true}
                            changeButton={true}
                            editable={false}
                            value={(values.team1Name && values.team1Name !==null? values.team1Name : '' )+ (values.team2Name && values.team2Name !==null? ', '+ values.team2Name : '' )+ (values.team3Name && values.team3Name !==null? ', '+ values.team3Name : '')}
                            onPressChangeButton={goToChangeDivision}
                          />
                           {generalErrorMessage !== null && (
                            <Text type={"warning"} style={{ textAlign: "center" }}>
                              {generalErrorMessage}
                            </Text>
                          )}

                          <TextField
                            // value={password}
                            label="Posisi Winning Culture:"
                            style={{ paddingTop: 0}}
                            inputStyle={{textAlign: 'left', paddingLeft: Spacing[12], paddingVertical: Spacing[4]}}
                            isRequired={false}
                            secureTextEntry={false}
                            isTextArea={true}
                            changeButton={true}
                            editable={false}
                            value={(values.userPosition)}
                            onPressChangeButton={goToChangePosition}
                          />
                           {generalErrorMessage !== null && (
                            <Text type={"warning"} style={{ textAlign: "center" }}>
                              {generalErrorMessage}
                            </Text>
                          )}
                    
                          {/* <TextField
                    // value={password}
                    label="No. HP:"
                    style={{ paddingTop: 0}}
                    isRequired={false}
                    secureTextEntry={false}
                    // isError={isError && (authStore.formErrorCode === 3 || authStore.formErrorCode === 15)}
                    // onChangeText={setPassword}
                    changeButton={true}
                    onPressChangeButton={goToChangePhone}
                  /> */}
                        </VStack>
                        <Spacer height={Spacing[12]} />
                        <VStack horizontal={Spacing[96]} vertical={Spacing[20]}>
                          <Button type={isDisableEditBtn? "negative" : "primary"} text={"Edit"} onPress={() => handleSubmit()} disabled={isDisableEditBtn} />
                        </VStack>
                      </VStack>
                    </>
                  )}
                </Formik>
                <Spacer height={Spacing[24]} />
              </ScrollView>
            </SafeAreaView>
            <Spinner
              visible={mainStore.isLoading}
              textContent={'Memuat...'}
              // textStyle={styles.spinnerTextStyle}
            />
          </VStack>
        </KeyboardAvoidingView>

        <Modal
          isOpen={isModalVisible}
          style={{
            height: "50%",
            width: dimensions.screenWidth - Spacing[24],
            backgroundColor: "rgba(52, 52, 52, 0)",
          }}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <VStack
              style={{
                backgroundColor: Colors.WHITE,
                borderRadius: Spacing[48],
                minHeight: Spacing[256],
                alignItems: "center",
                justifyContent: "center",
              }}
              horizontal={Spacing[24]}
              vertical={Spacing[24]}
            >
              <VStack horizontal={Spacing[24]} top={Spacing[24]} style={Layout.widthFull}>
                <VStack>
                  <Text
                    type={"body-bold"}
                    style={{ fontSize: Spacing[18], textAlign: "center" }}
                    text={modalTitle}
                  />
                  <Spacer height={Spacing[24]} />
                  <Text
                    type={"body"}
                    style={{ textAlign: "center" }}
                    text={modalDesc}
                  />
                  <Spacer height={Spacing[20]} />
                  <HStack bottom={Spacing[32]}>
                    <Spacer />
                    <MoodComponent data={modalIcon} height={Spacing[64]} width={Spacing[64]}/>
                    {/* <FastImage
                      style={{
                        height: Spacing[64],
                        width: Spacing[64],
                      }}
                      source={modalIcon}
                      resizeMode={"contain"}
                    /> */}
                    <Spacer />
                  </HStack>
                  <HStack bottom={Spacing[24]}>
                    <Spacer />
                    <VStack style={{ maxWidth: Spacing[256], minWidth: Spacing[128] }}>
                      <Button
                        type={"primary"}
                        text={"Kembali"}
                        style={{ height: Spacing[32], paddingHorizontal: Spacing[8] }}
                        textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
                        onPress={toggleModal}
                      />
                    </VStack>
                    <Spacer />
                  </HStack>
                </VStack>
              </VStack>
            </VStack>
          </View>
        </Modal>
      </>
    )
  },
)

export default MyAccount
