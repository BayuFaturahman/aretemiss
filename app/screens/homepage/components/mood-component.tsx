import React, { useEffect, useState } from "react";
import {HStack, VStack} from "@components/view-stack";
import {Colors, Spacing} from "@styles"
import FastImage, { Source } from "react-native-fast-image";
import {Text} from "@components";
import Spacer from "@components/spacer";


import nullProfileIcon from "@assets/icons/settings/null-profile-picture.png";
import senang from "@assets/icons/mood/senyum.png";
import senangBw from "@assets/icons/mood/senyum-bw.png";
import marah from "@assets/icons/mood/marah.png";
import marahBw from "@assets/icons/mood/marah-bw.png";
import sedih from "@assets/icons/mood/sedih.png";
import sedihBw from "@assets/icons/mood/sedih-bw.png";
import sakit from "@assets/icons/mood/sakit.png";
import sakitBw from "@assets/icons/mood/sakit-bw.png";
import terkejut from "@assets/icons/mood/kaget.png";
import terkejutBw from "@assets/icons/mood/kaget-bw.png";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";


export const MOOD_TYPE = [
  {
    label: 'senang',
    source: senang,
  },
  {
    label: 'senangBw',
    source: senangBw,
  },
  {
    label: 'marah',
    source: marah,
  },
  {
    label: 'marahBw',
    source: marahBw,
  },  
  {
    label: 'sedih',
    source: sedih,
  },
  {
    label: 'sedihBw',
    source: sedihBw,
  },
  {
    label: 'sakit',
    source: sakit,
  },
  {
    label: 'sakitBw',
    source: sakitBw,
  },  
  {
    label: 'terkejut',
    source: terkejut,
  },
  {
    label: 'terkejutBw',
    source: terkejutBw,
  },
]

export type MoodItemType = {
  avatarUrl: string
  user: {
    name: string
    title: string
  }
  moodType: Source
}

type MoodProps = {
  data: MoodItemType
  goToMood(): void
}

export const MoodComponent = ({data, goToMood = () => null}: MoodProps) => {
  // console.log('mood data ', data) 
  const [source, setSource] = useState<Source>();

  useEffect(() => {
    console.log('MasuK effect mood component')
    let tempSource = null
    setSource(senangBw)
    MOOD_TYPE.map((type, index) => {
      if (type.label === data.moodType) {
        tempSource = type.source
        return type.source
      } else {
        return null
      }
    })

    if (tempSource !== null) {
      setSource(tempSource)
    }
    
  })
  

  return(
    <>
    <HStack horizontal={Spacing[2]}>
      <HStack>
        <FastImage style={{
          height: Spacing[64],
          width: Spacing[64],
          borderRadius: Spacing[8]
        }} source={data.avatarUrl === '' ? nullProfileIcon : {uri: data.avatarUrl}} resizeMode={"cover"}/>
        <VStack left={Spacing[8]}>
          <Text type={'body-bold'} text={data.user.name} />
          <Text type={'body'} style={{fontSize: Spacing[12]}} text={data.user.title} />
        </VStack>
      </HStack>
      <Spacer />
      {/* Mood Icon */}
      {/* <TouchableOpacity onPress={goToMood}>
        <VStack>
          <FastImage style={{
            height: Spacing[42],
            width: Spacing[42]}} source={source} resizeMode={"contain"}/> 
          <HStack > 
            <Spacer /> 
            <Text type={'right-header'} style={{fontSize: Spacing[12]}} underlineWidth={Spacing[28]} text={'Mood'} /> 
            <Spacer /> 
          </HStack> 
        </VStack> 
      </TouchableOpacity> */}
    </HStack>
    </>
  )

}
