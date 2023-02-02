import React, { FC, useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { OnboardFlow, OnboardFlowProps, PageData, TextStyles } from 'react-native-onboard'
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
  const [currentPage, setCurrentPage] = useState(0)
  const [pages, setPages] = useState<PageData[]>([])
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

  function stepResponseDataToFlowResponse(
    data: any,
    actionType: string = 'STARTED_STEP'
  ): FlowResponse {
    return {
      foreignUserId: userId,
      flowSlug: flow.slug,
      stepId: pages[currentPage]?.id ?? 'unknown',
      data: data.data,
      actionType: actionType,
      createdAt: new Date(),
    }
  }

  let rawData = flow.data

  if (customVariables) {
    // Replace every ${variable} with the value of customVariables[variable] in rawData
    for (const [key, value] of Object.entries(customVariables)) {
      // Validate that value is a string
      if (typeof value !== 'string') {
        continue
      }

      const escapedValue = value.replace(/"/g, '\\"')
      rawData = rawData.replaceAll(new RegExp(`\\$\\{${key}\\}`, 'g'), escapedValue)
    }
  }

  const preParsedData = JSON.parse(rawData)
  let customVariablesFromAPI = {}
  // Check if there are any customVariables
  if (preParsedData.customVariables) {
    // Replace every ${variable} with the value of customVariables[variable] in rawData
    for (const [key, value] of Object.entries(preParsedData.customVariables)) {
      customVariablesFromAPI[key] = value

      if (typeof value !== 'string') {
        continue
      }

      const escapedValue = value.replace(/"/g, '\\"')
      rawData = rawData.replaceAll(new RegExp(`\\$\\{${key}\\}`, 'g'), escapedValue)
    }
  }

  let parsedData = JSON.parse(rawData)
  if (customVariables) {
    // Check if parsedData.data has any page types of  type multipleChoice
    // Then check if the page.props.dataSource is is set
    // If this is the case, override page.props.fields with data from the dataSource
    let index = 0
    for (const page of parsedData.data) {
      if (page.type === 'multipleChoice' && page.props.dataSource) {
        const dataSource = page.props.dataSource
        // Remvoe ${} from dataSource
        const dataSourceWithoutBrackets = dataSource.replace(/[${}]/g, '')
        // Check if dataSource is in customVariables
        if (customVariables[dataSourceWithoutBrackets]) {
          // Ensure that data is an array and that it has at least one element
          if (
            Array.isArray(customVariables[dataSourceWithoutBrackets]) &&
            customVariables[dataSourceWithoutBrackets].length > 0
          ) {
            parsedData.data[index].props.fields = customVariables[dataSourceWithoutBrackets]
          }
        }
      }
      index++
    }
  }

  if (pages.length == 0) {
    setPages(parsedData.data as PageData[])
  }

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

        // Check if page has changed
        if (lastFlowResponse && lastFlowResponse?.stepId !== flowResponse.stepId) {
          // New page -- complete the last page
          let flowResponse = lastFlowResponse
          flowResponse.actionType = 'COMPLETED_STEP'
          await addResponse(flowResponse)
          onFlowResponse?.(flowResponse)
        }
        setLastFlowResponse(flowResponse)
        await addResponse(flowResponse)
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
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
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
