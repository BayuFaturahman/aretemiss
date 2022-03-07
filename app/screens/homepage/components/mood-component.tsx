import React from "react";
import {Spacing} from "@styles"

import { MarahActive, MarahActiveBorder, MarahInactive, SedihActive, SedihActiveBorder, SedihInactive, SenyumActive, SenyumActiveBorder, SenyumInactive, SickActive, SickActiveBorder, SickInactive, SurprisedActive, SurprisedActiveBorder, SurprisedInactive } from "@assets/svgs"

type MoodProps = {
    data: string
    height?: number
    width?: number
}

export const MoodComponent = ({data, height=Spacing[42], width=Spacing[42]}: MoodProps) => {

  
    if (data === 'senang') {
        return <SenyumActive height={height} width={width}/>
    } else if (data === 'senangBorder') {
        return <SenyumActiveBorder height={height} width={width}/>
    } else if (data === 'senangInactive') {
        return <SenyumInactive height={height} width={width}/>
    } else if (data === 'marah') {
        return <MarahActive height={height} width={width}/>
    } else if (data === 'marahBorder') {
        return <MarahActiveBorder height={height} width={width}/>
    } else if (data === 'marahInactive') {
        return <MarahInactive height={height} width={width}/>
    } else if (data === 'sedih') {
        return <SedihActive height={height} width={width}/>
    } else if (data === 'sedihBorder') {
        return <SedihActiveBorder height={height} width={width}/>
    } else if (data === 'sedihInactive') {
        return <SedihInactive height={height} width={width}/>
    } else if (data === 'sakit') {
        return <SickActive height={height} width={width}/>
    } else if (data === 'sakitBorder') {
        return <SickActiveBorder height={height} width={width}/>
    } else if (data === 'sakitInactive') {
        return <SickInactive height={height} width={width}/>
    } else if (data === 'terkejut') {
        return <SurprisedActive height={height} width={width}/>
    } else if (data === 'terkejutBorder') {
        return <SurprisedActiveBorder height={height} width={width}/>
    } else if (data === 'terkejutInactive') {
        return <SurprisedInactive height={height} width={width}/>
    } else {
        return <SenyumInactive height={height} width={width}/>
    }

}
