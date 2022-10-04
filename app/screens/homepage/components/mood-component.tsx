import React from "react";
import {Spacing} from "@styles"

import {
    AngryBw,
    AngryColor,
    HappyColor, IconSadColor, IconSickColor, IconSurprisedColor,
    MarahActiveBorder,
    SedihActiveBorder,
    SedihInactive,
    SenyumActiveBorder,
    SenyumInactive,
    SickActiveBorder,
    SickInactive,
    SurprisedActiveBorder,
    SurprisedInactive
} from "@assets/svgs"

type MoodProps = {
    data: string
    height?: number
    width?: number
}

export const MoodComponent = ({data, height=Spacing[42], width=Spacing[42]}: MoodProps) => {

  
    if (data === 'senang') {
        return <HappyColor height={height} width={width}/>
    } else if (data === 'senangBorder') {
        return <SenyumActiveBorder height={height} width={width}/>
    } else if (data === 'senangInactive') {
        return <SenyumInactive height={height} width={width}/>
    } else if (data === 'marah') {
        return <AngryColor height={height} width={width}/>
    } else if (data === 'marahBorder') {
        return <MarahActiveBorder height={height} width={width}/>
    } else if (data === 'marahInactive') {
        return <AngryBw height={height} width={width}/>
    } else if (data === 'sedih') {
        return <IconSadColor height={height} width={width}/>
    } else if (data === 'sedihBorder') {
        return <SedihActiveBorder height={height} width={width}/>
    } else if (data === 'sedihInactive') {
        return <SedihInactive height={height} width={width}/>
    } else if (data === 'sakit') {
        return <IconSickColor height={height} width={width}/>
    } else if (data === 'sakitBorder') {
        return <SickActiveBorder height={height} width={width}/>
    } else if (data === 'sakitInactive') {
        return <SickInactive height={height} width={width}/>
    } else if (data === 'terkejut') {
        return <IconSurprisedColor height={height} width={width}/>
    } else if (data === 'terkejutBorder') {
        return <SurprisedActiveBorder height={height} width={width}/>
    } else if (data === 'terkejutInactive') {
        return <SurprisedInactive height={height} width={width}/>
    } else {
        return <SenyumInactive height={height} width={width}/>
    }

}
