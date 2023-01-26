import React, { FC, useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import {
  OnboardFlow,
  OnboardFlowProps,
  PageData,
  StepResponseData,
  TextStyles,
} from 'react-native-onboard'
import { useFlows } from '../api/flows'
import { FlowResponse, useFlowResponses } from '../api/flow-responses'
import { useUser } from '../api/users'

interface FrigadeFlowProps extends OnboardFlowProps, TextStyles {
  flowId: string
  onFlowResponse?: (flowResponse: FlowResponse) => void
}

export const FrigadeFlow: FC<FrigadeFlowProps> = ({
  flowId,
  onFlowResponse,
  customVariables,
  enableScroll,
  paginationColor,
  paginationSelectedColor,
  autoPlay,
  ...props
}) => {
  const { getFlow } = useFlows()
  const { userId } = useUser()
  const { addResponse, markFlowStarted, markFlowCompleted } = useFlowResponses()
  const [hasStartedFlow, setHasStartedFlow] = useState(false)
  const [hasEndedFlow, setHasEndedFlow] = useState(false)

  const flow = getFlow(flowId)

  if (!flow) {
    return (
      <View style={[styles.loader]}>
        <ActivityIndicator />
      </View>
    )
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

  function stepResponseDataToFlowResponse(stepResponseData: StepResponseData): FlowResponse {
    return {
      foreignUserId: userId,
      flowSlug: flow.slug,
      stepId: stepResponseData.source.id ?? 'unknown',
      data: stepResponseData.data,
      actionType: stepResponseData.data?.type === 'IMPRESSION' ? 'STARTED_STEP' : 'COMPLETED_STEP',
      createdAt: new Date(),
    }
  }

  const parsedData = JSON.parse(rawData)

  return (
    <OnboardFlow
      {...props}
      pages={parsedData.data as PageData[]}
      onSaveData={async (data) => {
        if (!hasStartedFlow) {
          setHasStartedFlow(true)
          const flowResponseStarted = await markFlowStarted(userId, flow.slug)
          onFlowResponse?.(flowResponseStarted)
        }
        const flowResponse = stepResponseDataToFlowResponse(data)
        await addResponse(flowResponse)
        onFlowResponse?.(flowResponse)
      }}
      onDone={async () => {
        if (!hasEndedFlow) {
          setHasEndedFlow(true)
          const flowResponse = await markFlowCompleted(userId, flow.slug)
          onFlowResponse?.(flowResponse)
        }
      }}
      autoPlay={parsedData.autoPlay ?? autoPlay}
      enableScroll={parsedData.enableScroll ?? enableScroll}
      paginationColor={parsedData.paginationColor ?? paginationColor}
      paginationSelectedColor={parsedData.paginationSelectedColor ?? paginationSelectedColor}
    />
  )
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
  },
})
