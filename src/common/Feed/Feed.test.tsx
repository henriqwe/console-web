import { render, screen, fireEvent } from '@testing-library/react'
import { Feed } from '.'
import { format } from 'date-fns'
import '@testing-library/jest-dom'

const feedContent = [
  {
    id: 1,
    content: 'Teste',
    //generate date in ms from 01/01/1970
    date: format(new Date().getTime(), 'yyyy-MM-dd HH:mm:ss.ms'),
    name: 'Fulano'
  },
  {
    id: 2,
    content: 'Teste 2',
    date: format(new Date().getTime() + 60 * 1000, 'yyyy-MM-dd HH:mm:ss.ms'),
    name: 'Ciclano'
  },
  {
    id: 3,
    content: 'Teste 3',
    date: format(
      new Date().getTime() + 60 * 1000 * 2,
      'yyyy-MM-dd HH:mm:ss.ms'
    ),
    name: 'Beltrano'
  }
]

describe('Feed', () => {
  feedContent.forEach((message) => {
    it(`should render the Feed with message ${message.content}`, () => {
      render(<Feed activity={feedContent} />)

      const renderedMessage = screen.getByText(message.content)
      expect(renderedMessage).toBeInTheDocument()

      const renderedMessageDate = screen.getByText(
        format(new Date(message.date), 'dd/MM/yyyy HH:mm:ss')
      )
      expect(renderedMessageDate).toBeInTheDocument()
    })
  })
})
