import React, {FC} from "react"
import {Dimensions, KeyboardAvoidingView, ScrollView, StyleSheet} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  Button, DropDownPicker,
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
      <VStack testID="CoachingJournalMain" style={{backgroundColor: Colors.WHITE, flex: 1, justifyContent: 'center'}}>
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

            <DropDownPicker
              isRequired={true} label="Pilih team:"
              onValueChange={(value)=>console.log('testt '+ value)}
              placeholder={'Pilih salah satu'}
              containerStyle={{marginTop: Spacing[4]}}
              zIndex={3000}
              zIndexInverse={1000}
              dropDownDirection={"BOTTOM"}
            />
            <DropDownPicker
              isRequired={false}
              label="Pilih team kedua (jika ada):"
              onValueChange={(value)=>console.log('testt '+ value)}
              placeholder={'Pilih salah satu'}
              containerStyle={{marginTop: Spacing[4]}}
              zIndex={2000}
              zIndexInverse={2000}
              dropDownDirection={"BOTTOM"}
            />
            <DropDownPicker
              isRequired={false}
              label="Pilih team kedua (jika ada):"
              onValueChange={(value)=>console.log('testt '+ value)}
              placeholder={'Pilih salah satu'}
              containerStyle={{marginTop: Spacing[4]}}
              zIndex={1000}
              zIndexInverse={3000}
              dropDownDirection={"BOTTOM"}
            />
            <VStack top={Spacing[8]}>
              <Text type={'body'} style={{textAlign: 'right'}}>
                * = Wajib diisi
              </Text>
            </VStack>
          </VStack>
          <VStack top={Spacing[32]} horizontal={Spacing[96]} style={{zIndex: -10}}>
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
