import React, {FC} from "react"
import { SafeAreaView, ImageBackground, StyleSheet } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  Button,
} from "@components"
import { NavigatorParamList } from "@navigators/auth-navigator"
import {VStack} from "@components/view-stack";
import Spacer from "@components/spacer";
import {Colors, Spacing} from "@styles";
import FastImage from "react-native-fast-image";
import RNAnimated from "react-native-animated-component";
import ileadBg from "@assets/images/bgLandingPage.png";
import ileadTopLogo from "@assets/images/landingPageTop.png";
import {AuthBottomLogo} from "@components/auth-bottom-logo";

const LandingPage: FC<StackScreenProps<NavigatorParamList, "verifyPhone">> = observer(
  ({ navigation }) => {

    const goToRegister = () => navigation.navigate("verifyPhone")
    const goToLogin = () => navigation.navigate("login")

    return (
      <VStack testID="CoachingJournalMain" style={{backgroundColor: Colors.WHITE, flex: 1, justifyContent: 'center'}}>
        <ImageBackground source={ileadBg} resizeMode="cover" style={styles.image}>
          <SafeAreaView style={{flex: 1}}>
            <RNAnimated
              appearFrom="bottom"
              animationDuration={500}
            >
              <FastImage style={{
                height: Spacing[320],
                top: -Spacing[24]
              }} source={ileadTopLogo} resizeMode={"contain"}/>
            </RNAnimated>
            <Spacer />
            <VStack horizontal={Spacing[96]} bottom={Spacing[48]}>
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
            <AuthBottomLogo />
          </SafeAreaView>
        </ImageBackground>
      </VStack>
    )
  },
)

export default LandingPage;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "center"
  },
});
