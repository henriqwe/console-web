import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Tabs } from '.'
import '@testing-library/jest-dom'
import React from 'react'
jest.mock('next/router', () => ({ push: jest.fn() }))

describe('Tabs', () => {
  
  it('should render the Tabs', () => {
    const { container } = render(
      <Tabs
        tabs={[{ name: 'attributes' }, { name: 'associations' }]}
        setSelectedTab={jest.fn}
      />
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render the Tabs with icons', () => {
    render(
      <Tabs
        tabs={[
          { name: 'attributes', icon: (props) => <svg {...props}>icon</svg> },
          {
            name: 'associations',
            icon: (props) => <svg {...props}>secondIcon</svg>
          }
        ]}
        selectedTab={{ name: 'attributes' }}
        setSelectedTab={jest.fn}
      />
    )
    const icon = screen.getByText('icon')
    expect(icon).toHaveClass('text-indigo-500')

    const second = screen.getByText('secondIcon')
    expect(second).not.toHaveClass('text-indigo-500')
    expect(icon).toBeInTheDocument()
  })

  it('should change the selected tab', () => {
    let number = 5
    const changeTab = jest.fn()
    render(
      <Tabs
        tabs={[{ name: 'attributes' }, { name: 'associations' }]}
        selectedTab={{ name: 'attributes' }}
        onchange={() => number++}
        setSelectedTab={changeTab}
      />
    )

    const setSelectedTab = jest.spyOn(React, 'useState')
    setSelectedTab.mockImplementation(((selectedTab: unknown) => [
      selectedTab,
      changeTab
    ]) as any)
    const firstTab = screen.getByTitle('attributes')
    expect(firstTab).toHaveClass('border-transparent text-indigo-500 bg-white')

    const secondTab = screen.getByTitle('associations')
    expect(secondTab).not.toHaveClass(
      'border-transparent text-indigo-500 bg-white'
    )
    fireEvent.click(secondTab)
    expect(number).toBe(6)
    expect(changeTab).toBeCalled()
  })
})
