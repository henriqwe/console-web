import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { AssociationTab } from '.'
import '@testing-library/jest-dom'

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: (val: string) => {
      mockPush(val)
    },
    query: { name: 'schema1' }
  })
}))

jest.mock('domains/console/SchemaManagerContext', () => ({
  useSchemaManager: () => ({
    selectedEntity: 'name',
    setReload: () => null,
    reload: false,
    setSelectedEntity: () => null,
    schemaTables: {
      name: {
        comment: '',
        createdat: 123,
        length: 1,
        nullable: false,
        type: 'string',
        unique: false
      }
    }
  })
}))

describe('AssociationTab', () => {
  it('should render AssociationTab component', () => {
    const { container } = render(<AssociationTab />)

    expect(container.firstChild).toBeInTheDocument()
  })
})
