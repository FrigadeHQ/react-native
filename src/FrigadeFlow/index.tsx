import React, { FC, useState } from 'react'
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
}

export const FrigadeFlow: FC<FrigadeFlowProps> = ({ flowId, customVariables, ...props }) => {
  const { getFlow } = useFlows()
  const { userId } = useUser()
  const { addResponse, markFlowStarted, markFlowCompleted } = useFlowResponses()
  const [hasStartedFlow, setHasStartedFlow] = useState(false)
  const [hasEndedFlow, setHasEndedFlow] = useState(false)

  const flow = getFlow(flowId)

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

  return (
    <OnboardFlow
      {...props}
      pages={JSON.parse(rawData).data as PageData[]}
      onSaveData={async (data) => {
        if (!hasStartedFlow) {
          setHasStartedFlow(true)
          await markFlowStarted(userId, flow.slug)
        }
        const flowResponse = stepResponseDataToFlowResponse(data)
        await addResponse(flowResponse)
      }}
      onDone={async () => {
        if (!hasEndedFlow) {
          setHasEndedFlow(true)
          await markFlowCompleted(userId, flow.slug)
        }
      }}
    />
  )
}
