import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'

type PixelContextProps = {
  pixel: any
}

type ProviderProps = {
  children: ReactNode
}

export const PixelContext = createContext<PixelContextProps>(
  {} as PixelContextProps
)

export const PixelProvider = ({ children }: ProviderProps) => {
  const [pixel, setPixel] = useState<any>(null)

  useEffect(
    () => {
      const isDevelopment = process.env.NODE_ENV === 'development'
      import('react-facebook-pixel')
        .then((x) => x.default)
        .then((ReactPixel) => {
          ReactPixel.init(
            process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID as string,
            {},
            { debug: isDevelopment }
          )

          setPixel(ReactPixel)

          // ReactPixel.pageView()
          // router.events.on('routeChangeComplete', () => {
          //   ReactPixel.pageView()
          // })
        })
    },
    [
      // router.events
    ]
  )

  return (
    <PixelContext.Provider value={{ pixel }}>{children}</PixelContext.Provider>
  )
}

export const usePixel = () => {
  return useContext(PixelContext)
}
