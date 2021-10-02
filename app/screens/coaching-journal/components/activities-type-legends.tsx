
import React from "react";
import {HStack} from "@components/view-stack";
import {Colors, Layout, Spacing} from "@styles";
import {Text} from "@components";
import {View} from "react-native";
import Spacer from "@components/spacer";

export const ACTIVITIES_TYPE = [
  {
    label: 'weekly coaching',
    value: 'weekly_coaching',
    color: Colors.HONEY_YELLOW
  },
  {
    label: 'kumpul santai',
    value: 'kumpul_santai',
    color: Colors.SOFT_PURPLE
  },
  {
    label: 'coached',
    value: 'coached',
    color: Colors.SOFT_GREEN
  }
]

type ActivitiesTypeLegendsProps = {
  showedItems?: Array<number>
}

export const ActivitiesTypeLegends = ({showedItems = [1,2,3]}:ActivitiesTypeLegendsProps) => {
    return(
      <HStack style={[Layout.widthFull, Layout.flexCenterMid]}>
        {ACTIVITIES_TYPE.map((item, index)=>{

          if(showedItems.includes(index + 1)){
            return(
              <HStack key={item.label} right={Spacing[8]}>
                <View style={{height: Spacing[16], width: Spacing[16], backgroundColor: item.color, borderRadius: Spacing[128]}} />
                <Spacer width={Spacing[4]} />
                <Text type={'body'} style={{}} text={item.label} />
              </HStack>
            )
          }
          return (
            <></>
          )
        })}
      </HStack>
  )
}
