import React, { FC, useCallback, useEffect, useState } from "react"
import { SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native"
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
import { dimensions } from "@config/platform.config"
import Modal from "react-native-modalbox"
import smileYellow from "@assets/icons/coachingJournal/empty/smile-yellow.png"

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
    const [isClickProfileUpdate, setIsClickProfileUpdate] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false)

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
      toggleModal()
    }, [])

    const onEditProfile = () => {
      setIsClickProfileUpdate(true)
      validateEmail()
    }

    useEffect(() => {
      setTimeout(() => {
        if (isEmailValid && isClickProfileUpdate) {
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
      }, 100);
   
    }, [isEmailValid, isClickProfileUpdate])

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

    const toggleModal = () => {
      setTimeout(() => {
        setModalVisible(!isModalVisible)
        setIsClickProfileUpdate(false)
      }, 100)
    }

    return (
      <>
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
                    secureTextEntry={false}
                    changeButton={true}
                    editable={false}
                    value={"******"}
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
                    text={"Hore!"}
                  />
                  <Spacer height={Spacing[24]} />
                  <Text
                    type={"body"}
                    style={{ textAlign: "center" }}
                    text={"Profil kamu sudah berhasil diganti."}
                  />
                  <Spacer height={Spacing[20]} />
                  <HStack bottom={Spacing[32]}>
                    <Spacer />
                    <FastImage
                      style={{
                        height: Spacing[64],
                        width: Spacing[64],
                      }}
                      source={smileYellow}
                      resizeMode={"contain"}
                    />
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
