
import React from "react";
import {Spacing} from "@styles"

import { CupActive, CupInActive, JerukActive, JerukInActive, PizzaActive, PizzaInActive, ShoeActive, ShoeInActive, TreeActive, TreeInActive } from "@assets/svgs"

type GroupIconProps = {
    data: string
    height?: number
    width?: number
}

export const GroupIconComponent = ({data, height=Spacing[54], width=Spacing[54]}: GroupIconProps) => {

  
    if (data === 'cup') {
        return <CupActive height={height} width={width}/>
    } else if (data === 'cupInactive') {
        return <CupInActive height={height} width={width}/>
    } else if (data === 'jeruk') {
        return <JerukActive height={height} width={width}/>
    } else if (data === 'jerukInactive') {
        return <JerukInActive height={height} width={width}/>
    } else if (data === 'pizza') {
        return <PizzaActive height={height} width={width}/>
    } else if (data === 'pizzaInactive') {
        return <PizzaInActive height={height} width={width}/>
    } else if (data === 'shoe') {
        return <ShoeActive height={height} width={width}/>
    } else if (data === 'shoeInactive') {
        return <ShoeInActive height={height} width={width}/>
    } else if (data === 'tree') {
        return <TreeActive height={height} width={width}/>
    } else if (data === 'treeInactive') {
        return <TreeInActive height={height} width={width}/>
    }

}
