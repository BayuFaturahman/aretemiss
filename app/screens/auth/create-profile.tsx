import React, {FC, useCallback, useEffect, useState} from "react"
import {Dimensions, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  BackNavigation,
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

import { Formik } from 'formik';

import { useStores } from "../../bootstrap/context.boostrap"

import Spinner from 'react-native-loading-spinner-overlay';
import {IOption} from "react-native-modal-selector";

export type ProfileUpdateForm = {
  fullname: string
  nickname: string
  email: string
  team1Id: string
  team2Id: string
  team3Id: string
}

const ProfileUpdateInitialForm: ProfileUpdateForm = {
  fullname: '',
  nickname: '',
  email: '',
  team1Id: '',
  team2Id: '',
  team3Id: ''
};

const CreateProfile: FC<StackScreenProps<NavigatorParamList, "createProfile">> = observer(
  ({ navigation }) => {

    const goToOTP = () => navigation.navigate("verifyOTP")

    const [teamList1, setTeamList1] = useState<IOption[]>([])

    const { authStore, mainStore } = useStores()

    const styles = StyleSheet.create({

    })

    const getTeam = useCallback(async ()=>{
      await mainStore.getTeamList()
    },[])

    useEffect(()=>{
      getTeam()
    },[])

    useEffect(()=>{
      if(mainStore.teamResponse !== null){
        const itemsData:IOption[] = mainStore.teamResponse.data.map((item, index)=>{
          return({
              key: index,
              label: item.name,
              id: item.id
          })
        })
        setTeamList1(itemsData)
      }
    },[mainStore.teamResponse])


    const goBack = () => {
      navigation.navigate("verifyPhone")
    }

    const onSubmit = useCallback(async (data: ProfileUpdateForm)=>{
      console.log(data)
      await mainStore.updateProfile(authStore.userId, data)
    },[])

    return (
      <VStack testID="CoachingJournalMain" style={{backgroundColor: Colors.WHITE, flex: 1, justifyContent: 'center'}}>
        <SafeAreaView style={{flex: 1}}>
          <KeyboardAvoidingView behavior='padding' style={{ minHeight: Dimensions.get('screen').height}}>
            <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
            <ScrollView bounces={false} style={[Layout.flex, Layout.heightFull]}>
            <Spacer height={Spacing[32]} />
            <Formik
              initialValues={ProfileUpdateInitialForm}
              onSubmit={onSubmit}
            >
              {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
                <>
                  <VStack top={Spacing[24]} horizontal={Spacing[24]}>
                    <Text type={'header'} text="Lengkapi profilmu." />
                    <Spacer height={Spacing[24]} />

                    <Text type={'warning'} style={{textAlign: 'center'}}>
                      {mainStore.errorMessage}
                    </Text>

                    <Spacer height={Spacing[32]} />
                    <TextField
                      label="Nama lengkap:"
                      style={{ paddingTop: 0}}
                      isError={false}
                      value={values.fullname}
                      onChangeText={handleChange('fullname')}
                    />
                    <TextField
                      label="Nama panggilan:"
                      style={{ paddingTop: 0}}
                      isError={false}
                      value={values.nickname}
                      onChangeText={handleChange('nickname')}
                    />
                    <TextField
                      label="Alamat e-mail:"
                      style={{ paddingTop: 0}}
                      isError={false}
                      value={values.email}
                      onChangeText={handleChange('email')}
                    />

                    <DropDownPicker
                      items={teamList1}
                      isRequired={true} label="Pilih team:"
                      // onValueChange={(value:IOption)=> setFieldValue('team1Id', value.id)}
                      onValueChange={(value:IOption)=> {
                        setFieldValue('team1Id', value?.id?? '')
                      }}
                      placeholder={'Pilih salah satu'}
                      containerStyle={{marginTop: Spacing[4]}}
                      zIndex={3000}
                      zIndexInverse={1000}
                      dropDownDirection={"BOTTOM"}
                    />
                    <DropDownPicker
                      items={teamList1}
                      isRequired={false}
                      label="Pilih team kedua (jika ada):"
                      onValueChange={(value:IOption)=> {
                        setFieldValue('team2Id', value?.id ?? '')
                      }}
                      placeholder={'Pilih salah satu'}
                      containerStyle={{marginTop: Spacing[4]}}
                      zIndex={2000}
                      zIndexInverse={2000}
                      dropDownDirection={"BOTTOM"}
                    />
                    <DropDownPicker
                      items={teamList1}
                      isRequired={false}
                      label="Pilih team kedua (jika ada):"
                      onValueChange={(value:IOption)=> {
                         setFieldValue('team3Id', value?.id ?? '')
                      }}
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
                      onPress={()=>handleSubmit()}
                    />
                  </VStack>
                </>
              )}
            </Formik>
            <Spacer height={Spacing[24]} />
            <FastImage style={{
              height: Spacing[96],
              marginLeft: Spacing[48],
              bottom: 0
            }} source={logoBottom} resizeMode={"contain"}/>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
        <Spinner
          visible={authStore.isLoading || mainStore.isLoading}
          textContent={'Memuat...'}
          // textStyle={styles.spinnerTextStyle}
        />
      </VStack>
    )
  },
)

export default CreateProfile;
