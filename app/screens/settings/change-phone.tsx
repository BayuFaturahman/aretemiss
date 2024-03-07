import React, { FC, useCallback, useState } from "react"
import { SafeAreaView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, BackNavigation, Button, TextField } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"

import { useStores } from "@models"

const ChangePhone: FC<StackScreenProps<NavigatorParamList, "settingsPage">> = observer(
  ({ navigation }) => {
    const { authStore } = useStores()
    const [phoneNumber, setPhoneNumber] = useState<string>("")
    const [confirmPhoneNumber, setConfirmPhoneNumber] = useState<string>("")
    const [isPhoneNumberMatch, setIsPhoneNumberMatch] = useState<boolean>(false)

    const goBack = () => navigation.goBack()

    const checkPhoneNumber = () => {
      console.log(phoneNumber)
      if (phoneNumber.length === 0 || phoneNumber != confirmPhoneNumber) {
        setIsPhoneNumberMatch(false)
        return
      }
      setIsPhoneNumberMatch(true)
      console.log("sama")
      // changePassword()
    }

    const goToMyAccount = () => navigation.navigate("myAccount")

    const logout = useCallback(() => {
      authStore.resetAuthStore()
    }, [])

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
            {!isPhoneNumberMatch && (
              <Text type={"warning"} style={{ textAlign: "center" }}>
                {
                  "Waduh. Nomor telepon ini tidak benar. Pastikan semua yang dimasukan ke dalam kolom berupa angka (0-9), tanpa ada tambahan karakter lainnya."
                }
              </Text>
            )}
            <VStack top={Spacing[32]} horizontal={Spacing[24]}>
              <Spacer height={Spacing[16]} />
              <TextField
                label="No. HP baru:"
                style={{ paddingTop: 0 }}
                isRequired={false}
                secureTextEntry={false}
                keyboardType={"numeric"}
                isError={!isPhoneNumberMatch}
                value={phoneNumber}
                onChangeText={(value) => setPhoneNumber(value)}
              />
              <Spacer height={Spacing[16]} />
              <TextField
                label="Masukan kembali no. HP baru:"
                style={{ paddingTop: 0 }}
                isRequired={false}
                secureTextEntry={false}
                keyboardType={"numeric"}
                isError={!isPhoneNumberMatch}
                value={confirmPhoneNumber}
                onChangeText={(value) => setConfirmPhoneNumber(value)}
              />
            </VStack>
            <Spacer height={Spacing[12]} />
            <VStack horizontal={Spacing[96]} vertical={Spacing[20]}>
              <Button type={"primary"} text={"Ganti no. HP"} onPress={checkPhoneNumber} />
            </VStack>
          </VStack>
        </SafeAreaView>
      </VStack>
    )
  },
)

export default ChangePhone
