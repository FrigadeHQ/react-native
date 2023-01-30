import React, { FC, useEffect, useState } from 'react'
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
  userIdOverride?: string
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
  userIdOverride,
  onDone,
  onNext,
  ...props
}) => {
  const { getFlow } = useFlows()
  const { userId, setUserId } = useUser()
  const { addResponse, markFlowStarted, markFlowCompleted } = useFlowResponses()
  const [hasStartedFlow, setHasStartedFlow] = useState(false)
  const [hasEndedFlow, setHasEndedFlow] = useState(false)
  const [lastFlowResponse, setLastFlowResponse] = useState<FlowResponse>(null)

  const flow = getFlow(flowId)

  useEffect(() => {
    if (userIdOverride) {
      setUserId(userIdOverride)
    }
  }, [userIdOverride])

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

  function stepResponseDataToFlowResponse(
    stepResponseData: StepResponseData,
    actionType: string = 'STARTED_STEP'
  ): FlowResponse {
    return {
      foreignUserId: userId,
      flowSlug: flow.slug,
      stepId: stepResponseData.source.id ?? 'unknown',
      data: stepResponseData.data,
      actionType: actionType,
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
        setLastFlowResponse(flowResponse)
        await addResponse(flowResponse)
        onFlowResponse?.(flowResponse)
      }}
      onNext={async () => {
        let flowResponse = lastFlowResponse
        if (!lastFlowResponse) {
          return
        }
        flowResponse.actionType = 'COMPLETED_STEP'
        await addResponse(flowResponse)
        if (onNext) {
          onNext()
        }
        onFlowResponse?.(flowResponse)
      }}
      onDone={async () => {
        if (!hasEndedFlow) {
          setHasEndedFlow(true)
          const flowResponse = await markFlowCompleted(userId, flow.slug)
          onFlowResponse?.(flowResponse)
        }
        if (onDone) {
          onDone()
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
