import React, { useContext, useState } from 'react'
import { API_PREFIX, useConfig } from './common'
import { FrigadeContext } from '../FrigadeProvider'

export interface FlowResponse {
  foreignUserId: string
  flowSlug: string
  stepId: string
  actionType: string
  data: object
  createdAt: Date
}

export function useFlowResponses() {
  const { config } = useConfig()
  const { failedFlowResponses, setFailedFlowResponses } = useContext(FrigadeContext)
  const [successfulFlowResponsesStrings, setSuccessfulFlowResponsesStrings] = useState<Set<String>>(
    new Set()
  )
  const [successfulFlowResponses, setSuccessfulFlowResponses] = useState<Set<FlowResponse>>(
    new Set()
  )

  const [flowResponseMap, setFlowResponseMap] = useState<Map<string, Map<string, FlowResponse>>>(
    new Map()
  )

  const [currentStep, setCurrentStep] = useState<string>('')

  function postFlowResponse(flowResponse: FlowResponse) {
    const flowResponseString = JSON.stringify(flowResponse)

    if (successfulFlowResponsesStrings.has(flowResponseString)) {
      return
    }
    successfulFlowResponsesStrings.add(flowResponseString)
    setSuccessfulFlowResponsesStrings(successfulFlowResponsesStrings)
    successfulFlowResponses.add(flowResponse)
    setSuccessfulFlowResponses(successfulFlowResponses)

    return fetch(`${API_PREFIX}flowResponses`, {
      ...config,
      method: 'POST',
      body: flowResponseString,
    }).then((r) => {
      if (r.status !== 200 && r.status !== 201) {
        console.log(
          'Failed to send flow response for step ' +
            flowResponse.stepId +
            '. Will retry again later.'
        )
        setFailedFlowResponses([...failedFlowResponses, flowResponse])
      }
    })
  }

  async function addResponse(flowResponse: FlowResponse) {
    if (flowResponse.actionType === 'STARTED_FLOW') {
      recordResponse(flowResponse)
      await sendDataToBackend() // Send previous step data to backend
    } else if (flowResponse.actionType === 'COMPLETED_FLOW') {
      recordResponse(flowResponse)
      await sendDataToBackend() // Send previous step data to backend
    } else if (flowResponse.actionType === 'STARTED_STEP') {
      setCurrentStep(flowResponse.stepId)
      recordResponse(flowResponse)
    } else if (flowResponse.actionType === 'COMPLETED_STEP') {
      await sendDataToBackend() // Send previous step data to backend
      setFlowResponseMap(new Map()) // Clear existing data
      recordResponse(flowResponse)
      await sendDataToBackend() // Send completed step data to backend
    }
  }

  async function sendDataToBackend() {
    for (const [stepId, responses] of flowResponseMap.entries()) {
      const pendingResponses = flowResponseMap.get(stepId)
      if (pendingResponses) {
        for (const [actionType, flowResponse] of pendingResponses) {
          await postFlowResponse(flowResponse)
        }
      }
      flowResponseMap.delete(stepId)
      setFlowResponseMap(flowResponseMap)
    }
  }

  function recordResponse(flowResponse: FlowResponse) {
    const stepId = flowResponse.stepId
    const actionType = flowResponse.actionType
    const stepMap = flowResponseMap.get(stepId) || new Map()
    stepMap.set(actionType, flowResponse)
    flowResponseMap.set(stepId, stepMap)
  }

  async function markFlowStarted(userId: string, flowSlug: string) {
    const flowResponse = {
      foreignUserId: userId,
      flowSlug: flowSlug,
      stepId: 'startFlow',
      actionType: 'STARTED_FLOW',
      data: {},
      createdAt: new Date(),
    }
    await addResponse(flowResponse)
    return flowResponse
  }

  async function markFlowCompleted(userId: string, flowSlug: string) {
    const flowResponse = {
      foreignUserId: userId,
      flowSlug: flowSlug,
      stepId: 'endFlow',
      actionType: 'COMPLETED_FLOW',
      data: { flowResponses: Array.from(successfulFlowResponses) },
      createdAt: new Date(),
    }
    await addResponse(flowResponse)
    return flowResponse
  }

  return { addResponse, markFlowStarted, markFlowCompleted }
}
