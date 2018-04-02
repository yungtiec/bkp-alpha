import React from 'react'
import './LoadingScreen.scss'
import { SquareLoader } from 'halogenium';


export default function LoadingScreen() {
  return <SquareLoader className="route__loader" color="#2d4dd1" size="16px" margin="4px"/>;
}
