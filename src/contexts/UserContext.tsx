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
