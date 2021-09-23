import React, { FC } from "react"
import { SafeAreaView, StyleSheet } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  Button,
} from "@components"
import { NavigatorParamList } from "@navigators/auth-navigator"
import {VStack} from "@components/view-stack";
import Spacer from "@components/spacer";
import {Colors, Spacing} from "@styles";
import ileadLogo from "@assets/icons/ilead-logo.png";
import FastImage from "react-native-fast-image";

const LandingPage: FC<StackScreenProps<NavigatorParamList, "verifyPhone">> = observer(
  ({ navigation }) => {

    const goToRegister = () => navigation.navigate("verifyPhone")
    const goToLogin = () => navigation.navigate("login")

    const styles = StyleSheet.create({

    })

    return (
      <VStack testID="LoginScreen" style={{backgroundColor: Colors.WHITE, flex: 1, justifyContent: 'center'}}>
        <SafeAreaView style={{flex: 1}}>
          <Spacer />
          <VStack horizontal={Spacing[24]}>

            <FastImage style={{
              height: Spacing[256],
              bottom: 0
            }} source={ileadLogo} resizeMode={"contain"}/>

          </VStack>
          <VStack top={Spacing[32]} horizontal={Spacing[96]}>
            <Button
              type={"primary-dark"}
              text={"Register"}
              onPress={goToRegister}
            />
            <Spacer height={Spacing[14]} />
            <Button
              type={"primary"}
              text={"Login"}
              onPress={goToLogin}
            />
          </VStack>
          <Spacer />
        </SafeAreaView>
      </VStack>
    )
  },
)

export default LandingPage;
