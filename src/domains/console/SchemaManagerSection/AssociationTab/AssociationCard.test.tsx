import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { AssociationCard } from './AssociationCard'
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
    selectedEntity: 'books',
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

describe('AssociationCard', () => {
  it('should render AssociationCard component', () => {
    const { container } = render(
      <AssociationCard
        attribute="name"
        selectedEntity="books"
        schemaTables={{
          books: {
            name: {
              comment: '',
              createdat: 123,
              length: 1,
              nullable: false,
              type: 'string',
              unique: false
            }
          }
        }}
      />
    )

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render AssociationCard without edit button', () => {
    render(
      <AssociationCard
        attribute="name"
        selectedEntity="books"
        schemaTables={{
          books: {
            name: {
              comment: '',
              createdat: 123,
              length: 1,
              nullable: false,
              type: 'string',
              unique: false
            }
          }
        }}
        noEdit
      />
    )

    const editButton = screen.queryByText('Edit')
    expect(editButton).not.toBeInTheDocument()
  })

  it('should render AssociationCard with reverse class', () => {
    render(
      <AssociationCard
        attribute="name"
        selectedEntity="books"
        schemaTables={{
          books: {
            name: {
              comment: '',
              createdat: 123,
              length: 1,
              nullable: false,
              type: 'string',
              unique: false
            }
          }
        }}
        reverse
      />
    )

    const attributeName = screen.getByText('name')
    expect(attributeName.parentElement?.lastChild).toHaveClass(
      'flex-row-reverse'
    )
  })

  it('should open field details', () => {
    render(
      <AssociationCard
        attribute="name"
        selectedEntity="books"
        schemaTables={{
          books: {
            name: {
              comment: '',
              createdat: 123,
              length: 1,
              nullable: false,
              type: 'string',
              unique: false
            }
          }
        }}
      />
    )

    const editButton = screen.getByText('Edit')
    fireEvent.click(editButton)
    expect(editButton).not.toBeInTheDocument()
    expect(screen.getByText('Close')).toBeInTheDocument()
  })
})
