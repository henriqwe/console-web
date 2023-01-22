import '@testing-library/jest-dom'
import { render, screen} from '@testing-library/react'
import { DataProvider, useData } from './DashboardContext'
import React from 'react'

describe('Dashboard context', () => {
  it('should render a component using Dashboard provider', async () => {
    const Component = () => {
      const { slideType } = useData()

      return <div>{slideType}</div>
    }
    render(
      <DataProvider>
        <Component />
      </DataProvider>
    )

    expect(screen.getByText(`createProject`)).toBeInTheDocument()
  })
})
