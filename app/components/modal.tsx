import { useNavigate } from '@remix-run/react'
import Portal from './portal'

export interface ModalProps {
  children: React.ReactNode
  isOpen: boolean
  ariaLabel?: string
  className?: string
}

export default function Modal(props: ModalProps) {
  const { children, isOpen, ariaLabel = 'Modal', className = '' } = props

  const navigate = useNavigate()

  if (!isOpen) return null
  return (
    <Portal wrapperId="modal">
      <div
        className="fixed inset-0 overflow-y-auto bg-gray-600 bg-opacity-80"
        aria-label={ariaLabel}
        role="dialog"
        aria-modal="true"
        onClick={() => navigate('/home')}
      ></div>
      <div className="pointer-events-none fixed inset-0 flex max-h-screen items-center justify-center overflow-scroll">
        <div
          className={`${className} pointer-events-auto max-h-screen bg-gray-200 p-4 md:rounded-xl`}
        >
          {/* This is where the modal content is rendered  */}
          {children}
        </div>
      </div>
    </Portal>
  )
}
