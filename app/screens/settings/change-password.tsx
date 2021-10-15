import React, { FC, useCallback, useState } from "react"
import { SafeAreaView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, BackNavigation, Button, TextField } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"

import { useStores } from "../../bootstrap/context.boostrap"

const ChangePassword: FC<StackScreenProps<NavigatorParamList, "changePassword">> = observer(
  ({ navigation }) => {
    const { authStore } = useStores()
    const [currentPassword, setCurrentPassword] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [isPasswordMatch, setIsPasswordMatch] = useState<boolean>(false)
    const [isSubmitPasswordChange, setIsSubmitPasswordChange] = useState<boolean>(false)

    const goBack = () => navigation.goBack()

    const goToMyAccount = () => navigation.navigate("myAccount")

    const logout = useCallback(() => {
      authStore.resetAuthStore()
    }, [])

    const changePassword = useCallback(async () => {
      await authStore.changePassword(currentPassword, password)
      setIsSubmitPasswordChange(false)
      goBack()
    }, [password])

    const checkPassword = () => {
      setIsSubmitPasswordChange(true)
      console.log(password)
      if (password.length === 0 || password != confirmPassword) {
        setIsPasswordMatch(false)
        return
      }
      setIsPasswordMatch(true)
      changePassword()
    }

    return (
      <VStack
        testID="CoachingJournalMain"
        style={{ backgroundColor: Colors.UNDERTONE_BLUE, flex: 1, justifyContent: "center" }}
      >
        <SafeAreaView style={Layout.flex}>
          <BackNavigation goBack={goBack} />
          <VStack top={Spacing[8]} horizontal={Spacing[24]} bottom={Spacing[12]}>
            <Spacer height={Spacing[24]} />
            <Text
              type={"header"}
              style={{ color: Colors.WHITE, fontSize: Spacing[16] }}
              text="Change Password"
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
            {!isPasswordMatch && isSubmitPasswordChange && (
              <Text type={"warning"} style={{ textAlign: "center" }}>
                {
                  "Hmm. Kelihatannya kedua password yang kamu isi tidak sama. Coba samakan password-nya dulu yah, baru bisa diproses nih."
                }
              </Text>
            )}
            <VStack top={Spacing[32]} horizontal={Spacing[24]}>
              <Spacer height={Spacing[16]} />
              <TextField
                label="Password saat ini:"
                style={{ paddingTop: 0 }}
                isRequired={false}
                secureTextEntry={true}
                isError={false}
                value={currentPassword}
                onChangeText={(value) => setCurrentPassword(value)}
              />
              <Spacer height={Spacing[16]} />
              <TextField
                label="Password baru:"
                style={{ paddingTop: 0 }}
                isRequired={false}
                secureTextEntry={true}
                isError={!isPasswordMatch && isSubmitPasswordChange}
                value={password}
                onChangeText={(value) => setPassword(value)}
              />
              <Spacer height={Spacing[16]} />
              <TextField
                label="Tulis ulang password barumu:"
                style={{ paddingTop: 0 }}
                isRequired={false}
                secureTextEntry={true}
                isError={!isPasswordMatch && isSubmitPasswordChange}
                value={confirmPassword}
                onChangeText={(value) => setConfirmPassword(value)}
              />
            </VStack>
            <Spacer height={Spacing[12]} />
            <VStack horizontal={Spacing[96]} vertical={Spacing[20]}>
              <Button type={"primary"} text={"Ganti Password"} onPress={checkPassword} />
            </VStack>
          </VStack>
        </SafeAreaView>
      </VStack>
    )
  },
)

export default ChangePassword
