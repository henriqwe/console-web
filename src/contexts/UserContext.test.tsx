import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { UserProvider, useUser } from './UserContext'
import React, { useEffect } from 'react'

describe('User context', () => {
  it('should render a component using user provider', async () => {
    const Component = () => {
      const { user, setUser } = useUser()

      useEffect(() => {
        setUser({
          name: 'aleatorio'
        })
      },[])

      return <div>{user?.name}</div>
    }
    render(
      <UserProvider>
        <Component />
      </UserProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(`aleatorio`)).toBeInTheDocument()
    })
  })
})
