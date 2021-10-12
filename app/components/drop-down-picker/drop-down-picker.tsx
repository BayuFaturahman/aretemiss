import React, {useEffect, useReducer, useState} from "react"
import {Colors, Layout, Spacing} from "@styles";

import DropDown, {DropDownPickerProps, ItemType} from 'react-native-dropdown-picker';
import {Text} from "@components/text/text";
import {HStack, VStack} from "@components/view-stack";
import Spacer from "@components/spacer";
import {Platform, StyleProp, TextStyle} from "react-native";
import {color, typography} from "@theme";

import ModalSelector from 'react-native-modal-selector'

const EXAMPLE_DATA = [
  { key: 1, label: 'Red Apples', customKey: 'Not a fruit' },
  { key: 2, label: 'Cherries', customKey: 'Not a fruit' },
  { key: 3, label: 'Cranberries', customKey: 'Not a fruit'},
  // etc...
  // Can also add additional custom keys which are passed to the onChange callback
  { key: 4, label: 'Vegetable', customKey: 'Not a fruit' }
];

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export interface DropDownProps extends DropDownPickerProps {
  onValueChange(items): void
  items?: ItemType[]
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
  const [value, setValue] = useState(null);
  const [items_, setItems] = useState(items);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(()=>{
    onValueChange(value)
    console.log(value)
  },[value])
  useEffect(()=>{
    console.log("items", items)
    setItems(items)
    forceUpdate()
  },[items])

  const renderRequired = () => {
    return isRequired === true ? <Text type={'label'} style={[{fontSize: Spacing[14]}, LABEL_STYLE]} text={`*`} /> : null
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

  const STYLES_CONTAINER = {
    minHeight: Spacing[256],
    // marginBottom: -300,
  }

  return (
    <VStack style={[containerStyle, {zIndex: rest.zIndex}, Platform.OS === 'android' && open && STYLES_CONTAINER]}>
      <HStack>
        {renderRequired()}
        <Text type={'label'} style={[{fontSize: Spacing[14]}, LABEL_STYLE]} text={label} />
      </HStack>
      <Spacer height={Spacing[4]} />

      <ModalSelector
        touchableStyle={{width: '100%'}}
        style={[Layout.widthFull,{flex:1}]}
        selectStyle={{
          flex:1,
          minWidth: Spacing['160'] + Spacing[72],
          borderColor: isError ? Colors.MAIN_RED : Colors.MAIN_BLUE,
          borderWidth: Spacing[2],
          borderRadius: Spacing[20],
          maxHeight: 44,
        }}
        data={items_}
        initValue="Select something yummy!"
        onChange={(option)=>{ setValue(option) }}
        selectTextPassThruProps={{style: TEXT_STYLE}}
        passThruProps={{style: {width: '100%', flex:1}}}
      />

      {/* <DropDown */}
      {/*  open={open} */}
      {/*  value={value} */}
      {/*  items={items_} */}
      {/*  setOpen={setOpen} */}
      {/*  setValue={setValue} */}
      {/*  setItems={setItems} */}
      {/*  style={{ */}
      {/*    borderColor: isError ? Colors.MAIN_RED : Colors.MAIN_BLUE, */}
      {/*    borderWidth: Spacing[2], */}
      {/*    borderRadius: Spacing[20], */}
      {/*    maxHeight: 44, */}
      {/*  }} */}
      {/*  textStyle={TEXT_STYLE} */}
      {/*  dropDownContainerStyle={{ */}
      {/*    borderRadius: Spacing[20], */}
      {/*    borderColor: isError ? Colors.MAIN_RED : Colors.MAIN_BLUE, */}
      {/*    borderWidth: Spacing[2], */}
      {/*    zIndex: rest.zIndex + 100 */}
      {/*  }} */}
      {/*  placeholder={placeholder} */}
      {/*  {...rest} */}
      {/* /> */}
    </VStack>
  )
}
