import { Dispatch, SetStateAction, useState } from 'react'
import { createContext, ReactNode, useContext } from 'react'

type ProvedorProps = {
  children: ReactNode
}

export type UserType = {
  name?: string
  email?: string
  image?: string
  accessToken?: string
  access_token: string
  id: number
  jti: string
  refresh_token: string
  scope: string
  status: number
  token_type: string
  username: string
}

type UserContextProps = {
  user: UserType | undefined
  setUser: Dispatch<SetStateAction<UserType | undefined>>
}

export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps
)

export const UserProvider = ({ children }: ProvedorProps) => {
  const [user, setUser] = useState<UserType>()

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  return useContext(UserContext)
}
