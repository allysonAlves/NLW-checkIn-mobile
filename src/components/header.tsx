import { View, Text } from 'react-native'
import React from 'react'

type Props = {
    title: string
}

export default function Header({title}: Props) {
  return (
    <View className='flex-row items-end w-full h-28 bg-black/20 px-8 pb-4 border-b border-white/10'>
      <Text className='flex-1 text-center text-white font-medium text-lg'>{title}</Text>
    </View>
  )
}