import clsx from 'clsx'
import { forwardRef } from 'react'

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}

export const ContainerOuter = forwardRef<HTMLDivElement, ContainerProps>(
  function OuterContainer({ className, children, ...props }, ref) {
    return (
      <div ref={ref} className={clsx('sm:px-8', className)} {...props}>
        <div className="mx-auto w-full max-w-7xl lg:px-8">{children}</div>
      </div>
    )
  }
)

export const ContainerInner = forwardRef<HTMLDivElement, ContainerProps>(
  function InnerContainer({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={clsx('relative px-4 sm:px-8 lg:px-12', className)}
        {...props}
      >
        <div className="mx-auto max-w-2xl lg:max-w-5xl">{children}</div>
      </div>
    )
  }
)

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  function Container({ children, ...props }, ref) {
    return (
      <ContainerOuter ref={ref} {...props}>
        <ContainerInner>{children}</ContainerInner>
      </ContainerOuter>
    )
  }
) 