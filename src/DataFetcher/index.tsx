import React, { FC, useContext, useEffect } from 'react'
import { useFlows } from '../api/flows'
import { FrigadeContext } from '../FrigadeProvider'
import { useUser } from '../api/users'
import uuid from 'react-native-uuid'
import { Image } from 'react-native'

interface DataFetcherProps {}

export const DataFetcher: FC<DataFetcherProps> = ({}) => {
  const { getFlows } = useFlows()
  const { userId, setUserId } = useUser()
  const { setFlows, setHasLoadedData } = useContext(FrigadeContext)

  async function prefetchFlows() {
    const flows = await getFlows()
    if (flows && flows?.data) {
      let preFetchTasks = []
      // Prefetch any imageUris in the flows
      flows.data.forEach((flow) => {
        const data = JSON.parse(flow.data)
        if (data.data && data.data.length) {
          data.data.forEach((d) => {
            if (d.imageUri) {
              preFetchTasks.push(Image.prefetch(d.imageUri))
            }
          })
        }
      })
      if (preFetchTasks.length > 0) {
        await Promise.all(preFetchTasks).then((results) => {
          setFlows(flows.data)
          setHasLoadedData(true)
        })
      } else {
        setFlows(flows.data)
        setHasLoadedData(true)
      }
    } else {
      console.error('Failed to prefetch flows')
    }
  }

  function generateGuestUserId() {
    // If userId is null, generate a guest user id using uuid
    if (userId === null) {
      setUserId('guest_' + uuid.v4())
    }
  }

  useEffect(() => {
    prefetchFlows()
    generateGuestUserId()
  }, [])
  return <></>
}
