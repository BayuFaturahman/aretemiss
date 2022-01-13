import React, {useEffect, useReducer, useState} from "react"
import {Colors, Spacing} from "@styles";

import {Text} from "@components/text/text";
import {HStack, VStack} from "@components/view-stack";
import Spacer from "@components/spacer";
import {Platform, StyleProp, TextStyle} from "react-native";
import {color, typography} from "@theme";

import {Button} from "@components/button/button";

import SelectBox from 'react-native-multi-selectbox'


export type DropDownItem = {
  item: string;
  id: string;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export interface DropDownProps {
  onValueChange(items): void
  items?: DropDownItem[]
  label?: string
  isRequired: boolean
  isError?: boolean
  placeholder: string
  containerStyle?: StyleProp<StyleProp<any>>
  open?
  value?
  setOpen?
  setValue?
  setItems?
}

/**
 * A component which has a label and an input together.
 */
export function DropDownPicker(props: DropDownProps) {
  const {
    onValueChange,
    items,
    label,
    isRequired,
    isError,
    placeholder,
    containerStyle,
    ...rest
  } = props

  const [open, setOpen] = useState(false);
  const [items_, setItems] = useState(items);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const [value, setValue] = useState({})

  useEffect(() => {
    onValueChange(value)
  }, [value])
  useEffect(() => {
    setItems(items)
    forceUpdate()
  }, [items])

  const renderRequired = () => {
    return isRequired === true ? <Text type={'label'} style={[{fontSize: Spacing[14]}, LABEL_STYLE]} text={`*`}/> : null
  }

  const clearSelection = () => {
    setSelectedTeam({})
    console.log(value)
    forceUpdate()
  }

  const LABEL_STYLE = {
    color: isError ? Colors.MAIN_RED : Colors.UNDERTONE_BLUE,
  }

  const TEXT_STYLE: TextStyle = {
    fontFamily: typography.primary,
    color: Colors.UNDERTONE_BLUE,
    fontSize: Spacing[16],
    backgroundColor: color.palette.white,
    textAlign: 'center',
  }

  const TEXT_STYLE_SELECTED: TextStyle = {
    fontFamily: typography.primary,
    color: Colors.UNDERTONE_BLUE,
    fontSize: Spacing[16],
    backgroundColor: color.palette.white,
  }

  const STYLES_CONTAINER = {
    minHeight: Spacing[256],
    // marginBottom: -300,
  }

  return (
    <VStack top={Spacing[8]} style={[containerStyle, {zIndex: rest.zIndex}, Platform.OS === 'android' && open && STYLES_CONTAINER]}>
      <HStack>
        {renderRequired()}
        <Text type={'label'} style={[{fontSize: Spacing[14]}, LABEL_STYLE]} text={label}/>
      </HStack>
      <Spacer height={Spacing[4]}/>

      <Button
        type={"primary"}
        text={'X'}
        style={{height: Spacing[28], width: Spacing[28], paddingHorizontal: Spacing[8],
          position: 'absolute', right: 0, top: Spacing[12], zIndex: 10}}
        textStyle={{fontSize: Spacing[14], lineHeight: Spacing[18]}}
        onPress={clearSelection}
      />

      <VStack
        style={
          {
            flex:1,
            borderColor: isError ? Colors.MAIN_RED : Colors.MAIN_BLUE,
            borderWidth: Spacing[2],
            borderRadius: Spacing[20],
          }
        }
      >
        <SelectBox
          label=""
          options={items}
          value={value}
          onChange={onChange()}
          hideInputFilter={false}
          containerStyle={{
            top: -Spacing[8],
            paddingHorizontal: Spacing[12],
            borderBottomWidth: 0,
          }}
          optionContainerStyle={{
            paddingHorizontal: Spacing[12],
            borderBottomWidth: 0,
          }}
          inputFilterStyle={{
            paddingHorizontal: Spacing[12],
          }}
          selectIcon={<></>}
          inputPlaceholder={placeholder}
          optionsLabelStyle={TEXT_STYLE}
          selectedItemStyle={TEXT_STYLE_SELECTED}
          listOptionProps={{ nestedScrollEnabled: true }}
        />
      </VStack>
    </VStack>
  )

  function onChange() {
    return (val) => setValue(val)
  }
}

const K_OPTIONS = [
  {
    item: 'Juventus',
    id: 'JUVE',
  },
  {
    item: 'Real Madrid',
    id: 'RM',
  },
  {
    item: 'Barcelona',
    id: 'BR',
  },
  {
    item: 'PSG',
    id: 'PSG',
  },
  {
    item: 'FC Bayern Munich',
    id: 'FBM',
  },
  {
    item: 'Manchester United FC',
    id: 'MUN',
  },
  {
    item: 'Manchester City FC',
    id: 'MCI',
  },
  {
    item: 'Everton FC',
    id: 'EVE',
  },
  {
    item: 'Tottenham Hotspur FC',
    id: 'TOT',
  },
  {
    item: 'Chelsea FC',
    id: 'CHE',
  },
  {
    item: 'Liverpool FC',
    id: 'LIV',
  },
  {
    item: 'Arsenal FC',
    id: 'ARS',
  },

  {
    item: 'Leicester City FC',
    id: 'LEI',
  },
]