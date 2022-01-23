import React, {FC} from "react"
import { SafeAreaView } from "react-native"
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
import RNAnimated from "react-native-animated-component";

const LandingPage: FC<StackScreenProps<NavigatorParamList, "verifyPhone">> = observer(
  ({ navigation }) => {

    const goToRegister = () => navigation.navigate("verifyPhone")
    const goToLogin = () => navigation.navigate("login")

    return (
      <VStack testID="CoachingJournalMain" style={{backgroundColor: Colors.WHITE, flex: 1, justifyContent: 'center'}}>
        <SafeAreaView style={{flex: 1}}>
          <RNAnimated
            appearFrom="bottom"
            animationDuration={500}
          >
            <Spacer height={Spacing[48]} />
          </RNAnimated>
          <Spacer />
          <VStack horizontal={Spacing[24]}>

            <RNAnimated
              appearFrom="bottom"
              animationDuration={500}
            >
              <FastImage style={{
                height: Spacing[256] - Spacing[24],
                bottom: 0
              }} source={ileadLogo} resizeMode={"contain"}/>
            </RNAnimated>

          </VStack>
          <VStack top={Spacing[48]} horizontal={Spacing[96]} bottom={Spacing[48]}>
            <RNAnimated
              appearFrom="bottom"
              animationDuration={700}
            >
              <Button
                type={"primary-dark"}
                text={"Register"}
                onPress={goToRegister}
              />
            </RNAnimated>
            <Spacer height={Spacing[14]} />
            <RNAnimated
              appearFrom="bottom"
              animationDuration={1000}
            >
              <Button
                type={"primary"}
                text={"Login"}
                onPress={goToLogin}
              />
            </RNAnimated>
          </VStack>
          <Spacer />
        </SafeAreaView>
      </VStack>
    )
  },
)

export default LandingPage;
