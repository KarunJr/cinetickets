import { font } from '@/lib/font'
import React from 'react'

interface TitleProps{
    text1: string,
    text2: string
}

const Title = ({text1, text2}:TitleProps) => {
  return (
    <h1 className={`${font.className} font-semibold text-2xl px-4`}>
        {text1} <span className='text-red-500 underline'>{text2}</span>
    </h1>
  )
}

export default Title
