import React, { FC } from "react"
import {Dimensions, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet} from "react-native"
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
import {Colors, Layout, Spacing} from "@styles";
import logoBottom from "@assets/icons/ilead-bottom-logo.png";
import FastImage from "react-native-fast-image";

const CreateProfile: FC<StackScreenProps<NavigatorParamList, "createProfile">> = observer(
  ({ navigation }) => {

    const goToOTP = () => navigation.navigate("verifyOTP")
    const goToLogin = () => navigation.navigate("login")

    const styles = StyleSheet.create({

    })

    return (
      <VStack testID="LoginScreen" style={{backgroundColor: Colors.WHITE, flex: 1, justifyContent: 'center'}}>
        {/* <GradientBackground colors={["#422443", "#281b34"]} /> */}
        <KeyboardAvoidingView behavior='padding' style={{ minHeight: Dimensions.get('screen').height}}>
          <ScrollView bounces={false} style={[Layout.flex, Layout.heightFull]}>
          <Spacer height={Spacing[32]} />
          <VStack top={Spacing[24]} horizontal={Spacing[24]}>
            <Text type={'header'} text="Lengkapi profilmu." />
            <Spacer height={Spacing[24]} />

             <Text type={'warning'} style={{textAlign: 'center'}}>
               Kayaknya ada yang belum diisi nih.
               Yuk isi semua kolomnya!
             </Text>

            <Spacer height={Spacing[32]} />
            <TextField
              label="Nama lengkap:"
              style={{ paddingTop: 0}}
              isError={false}
            />
            <TextField
              label="Nama panggilan:"
              style={{ paddingTop: 0}}
              isError={false}
            />
            <TextField
              label="Alamat e-mail:"
              style={{ paddingTop: 0}}
              isError={false}
            />
            <TextField
              label="Alamat e-mail:"
              style={{ paddingTop: 0}}
              isError={true}
            />
            <TextField
              label="Alamat e-mail:"
              style={{ paddingTop: 0}}
              isError={false}
            />
            <TextField
              label="Alamat e-mail:"
              style={{ paddingTop: 0}}
              isError={false}
            />
            {/* <TextField */}
            {/*  // value={'089123123123'} */}
            {/*  label="Password baru:" */}
            {/*  style={{ paddingTop: 0}} */}
            {/*  secureTextEntry={true} */}
            {/*  isRequired={true} */}
            {/* /> */}
          </VStack>
          <VStack top={Spacing[32]} horizontal={Spacing[96]}>
            <Button
              type={"primary"}
              text={"Simpan"}
              onPress={goToOTP}
            />
          </VStack>
          <Spacer height={Spacing[24]} />
          <FastImage style={{
            height: Spacing[96],
            marginLeft: Spacing[48],
            bottom: 0
          }} source={logoBottom} resizeMode={"contain"}/>
          </ScrollView>
        </KeyboardAvoidingView>
      </VStack>
    )
  },
)

export default CreateProfile;
