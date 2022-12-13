import { createPortal } from 'react-dom'
import * as React from 'react'

export interface PortalProps {
  children: React.ReactNode
  wrapperId: string
}

const createWrapper = (wrapperId: string) => {
  const wrapper = document.createElement('div')
  wrapper.setAttribute('id', wrapperId)
  document.body.appendChild(wrapper)
  return wrapper
}

export default function Portal(props: PortalProps) {
  const [wrapper, setWrapper] = React.useState<HTMLElement | null>(null)

  React.useEffect(() => {
    let element = document.getElementById(props.wrapperId)
    let created = false

    if (!element) {
      element = createWrapper(props.wrapperId)
      created = true
    }

    setWrapper(element)
    return () => {
      if (created && element?.parentNode) {
        element.parentNode.removeChild(element)
      }
    }
  }, [props?.wrapperId])

  if (!wrapper) return null

  return createPortal(props.children, wrapper)
}
