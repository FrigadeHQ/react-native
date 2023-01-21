import React, { FC } from 'react'
import { OnboardFlow, OnboardFlowProps, PageData, TextStyles } from 'react-native-onboard'
import { useGetMyFlow } from '../api/flows'

interface FrigadeFlowProps extends OnboardFlowProps, TextStyles {
  flowId: string
}

export const FrigadeFlow: FC<FrigadeFlowProps> = ({ flowId, customVariables, ...props }) => {
  const { flow } = useGetMyFlow(flowId)

  if (!flow) {
    console.error('Failed to load Frigade flow with id', flowId)
    return null
  }

  let rawData = flow.data

  if (customVariables) {
    // Replace every ${variable} with the value of customVariables[variable] in rawData
    for (const [key, value] of Object.entries(customVariables)) {
      // Validate that value is a string
      if (typeof value !== 'string') {
        console.error('Custom variable', key, 'is not a string. Skipping for now')
        continue
      }

      const escapedValue = value.replace(/"/g, '\\"')
      rawData = rawData.replaceAll(new RegExp(`\\$\\{${key}\\}`, 'g'), escapedValue)
    }
  }

  return (
    <OnboardFlow
      {...props}
      pages={JSON.parse(rawData).data as PageData[]}
      onSaveData={(data) => {
        {
          // console.log('Data saved', data)
        }
      }}
    />
  )
}
