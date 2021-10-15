import React, { FC, useCallback, useState } from "react"
import { SafeAreaView, ScrollView, TouchableOpacity } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, BackNavigation, Button, TextField } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"

import { useStores } from "../../bootstrap/context.boostrap"
import FastImage from "react-native-fast-image"
import nullProfileIcon from "@assets/icons/settings/null-profile-picture.png"
import { SettingsCardWrapper } from "./components/settings-card-wrapper"
import { SettingsSuccessUpdateProfile } from "./components/settings-succes-update-profile"
import { dimensions } from "@config/platform.config"

export type ProfileUpdateForm = {
  fullname: string
  nickname: string
  email: string
  team1Id: string
  team2Id: string
  team3Id: string
  isAllowNotification?: number
  isAllowReminderNotification?: number
}

const MyAccount: FC<StackScreenProps<NavigatorParamList, "myAccount">> = observer(
  ({ navigation }) => {
    const { authStore, mainStore } = useStores()

    const [nickname, setNickname] = useState(mainStore.userProfile.nickName)
    const [email, setEmail] = useState(mainStore.userProfile.email)
    const [isEmailValid, setIsEmailValid] = useState(true)
    const [isProfileUpdated, setIsProfileUpdated] = useState(false)

    const goBack = () => navigation.goBack()

    const goToChangePassword = () => navigation.navigate("changePassword")

    const goToChangePhone = () => navigation.navigate("changePhone")

    const validateEmail = () => {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
      if (reg.test(email) === false) {
        console.log("Email is Not Correct")
        setIsEmailValid(false)
        return
      } else {
        setIsEmailValid(true)
        console.log("Email is Not Correct")
      }
    }

    const submitEditProfile = useCallback(async (data: ProfileUpdateForm) => {
      console.log(data)
      await mainStore.updateProfile(authStore.userId, data)
      setIsProfileUpdated(true)
    }, [])

    const onEditProfile = () => {
      validateEmail()
      if (isEmailValid) {
        const userProfile: ProfileUpdateForm = {
          fullname: mainStore.userProfile.fullName,
          nickname: nickname,
          email: email,
          team1Id: mainStore.userProfile.team1Id,
          team2Id: mainStore.userProfile.team2Id,
          team3Id: mainStore.userProfile.team3Id,
          isAllowNotification: mainStore.userProfile.isAllowNotification,
          isAllowReminderNotification: mainStore.userProfile.isAllowReminderNotification,
        }
        submitEditProfile(userProfile)
      }
    }

    const ChangeProfilePicture = ({ isError = false }) => {
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
                style={{ height: Spacing[128], width: Spacing[128] }}
                source={nullProfileIcon}
                resizeMode={"contain"}
              />
            </VStack>
            <VStack style={{ width: Spacing[128] }} top={Spacing[20]}>
              <Button type={"primary"} text={"Ganti Foto"} />
            </VStack>
          </HStack>
        </VStack>
      )
    }

    if (isProfileUpdated) {
      return (
        <VStack top={dimensions.screenHeight / 2} horizontal={Spacing[12]}>
          <SettingsCardWrapper>
            <SettingsSuccessUpdateProfile navigateTo={goBack} />
          </SettingsCardWrapper>
        </VStack>
      )
    }

    return (
      <VStack
        testID="CoachingJournalMain"
        style={{ backgroundColor: Colors.UNDERTONE_BLUE, flex: 1, justifyContent: "center" }}
      >
        <SafeAreaView style={Layout.flex}>
          <BackNavigation goBack={goBack} />
          <ScrollView>
            <VStack top={Spacing[8]} horizontal={Spacing[24]} bottom={Spacing[12]}>
              <Spacer height={Spacing[24]} />
              <Text
                type={"header"}
                style={{ color: Colors.WHITE, fontSize: Spacing[16] }}
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
                <ChangeProfilePicture />
                <Spacer height={Spacing[32]} />
                <TextField
                  // value={phoneNumber}
                  label="Nama panggilan:"
                  isRequired={false}
                  style={{ paddingTop: 0 }}
                  // isError={isError && (authStore.formErrorCode === 2 || authStore.formErrorCode === 1 || authStore.formErrorCode === 10 || authStore.formErrorCode === 15)}
                  value={nickname}
                  onChangeText={(value) => setNickname(value)}
                  keyboardType={"numeric"}
                />
                <TextField
                  // value={password}
                  label="Alamat e-mail:"
                  style={{ paddingTop: 0 }}
                  isRequired={false}
                  secureTextEntry={false}
                  isError={!isEmailValid}
                  value={email}
                  onChangeText={(value) => setEmail(value)}
                  // isError={isError && (authStore.formErrorCode === 3 || authStore.formErrorCode === 15)}
                  // onChangeText={setPassword}
                />
                {!isEmailValid && (
                  <Text type={"warning"} style={{ textAlign: "center" }}>
                    {
                      "Alamat email yang kamu ganti formatnya salah. Pastikan alamat emailnya sudah kamu tulis dengan benar ya!"
                    }
                  </Text>
                )}
                <Spacer height={Spacing[12]} />
                <TextField
                  // value={password}
                  label="Password:"
                  style={{ paddingTop: 0 }}
                  isRequired={false}
                  secureTextEntry={true}
                  changeButton={true}
                  editable={false}
                  value={authStore.password}
                  onPressChangeButton={goToChangePassword}
                />
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
                <Button type={"primary"} text={"Edit"} onPress={onEditProfile} />
              </VStack>
            </VStack>
          </ScrollView>
        </SafeAreaView>
      </VStack>
    )
  },
)

export default MyAccount
