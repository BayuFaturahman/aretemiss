
import React from "react";
import {HStack} from "@components/view-stack";
import {Colors, Layout, Spacing} from "@styles";
import {Text} from "@components";
import {View} from "react-native";
import Spacer from "@components/spacer";

export const ACTIVITIES_TYPE = [
  {
    label: 'KPI coaching',
    value: 'formal_coaching',
    color: Colors.HONEY_YELLOW
  },
  {
    label: 'Project Culture coaching',
    value: 'informal_coaching',
    color: Colors.SOFT_PURPLE
  },
  {
    label: 'Others',
    value: 'other',
    color: Colors.SOFT_BLUE
  },
  {
    label: 'Coached',
    value: 'coached',
    color: Colors.SOFT_GREEN
  }
]

type ActivitiesTypeLegendsProps = {
  showedItems?: Array<number>
}

export const ActivitiesTypeLegends = ({showedItems = [1,2,3,4]}:ActivitiesTypeLegendsProps) => {
    return(
      <HStack style={[Layout.widthFull, Layout.flexTopCenter]}>
        {ACTIVITIES_TYPE.map((item, index)=>{

          if(showedItems.includes(index + 1)){
            return(
              <HStack key={item.label} right={Spacing[8]} style={[Layout.flexTopCenter, {maxWidth: '25%'}]} >
                <View style={{height: Spacing[14], width: Spacing[14], backgroundColor: item.color, borderRadius: Spacing[128]}} />
                <Spacer width={Spacing[4]} />
                <Text type={'body'} style={{ fontSize: Spacing[12]}} text={item.label} />
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
