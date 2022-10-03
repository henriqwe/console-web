import * as Common from 'common'
import ReactPlayer from 'react-player/youtube'
import { useState } from 'react'

const navigation = [
  {
    title: '1t',
    subtopics: [
      {
        title: 'title 1t1s',
        videoLink:
          'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley',
        content: 'content in first subtopic'
      },
      {
        title: 'title 1t2s',
        videoLink:
          'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley',
        content: 'content in second subtopic'
      },
      {
        title: 'title 1t3s',
        videoLink:
          'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley',
        content: 'content in third subtopic'
      }
    ]
  },
  {
    title: '2t',
    subtopics: [
      {
        title: 'title 2t1s',
        videoLink:
          'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley',
        content: 'content in first subtopic'
      },
      {
        title: 'title 2t2s',
        videoLink:
          'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley',
        content: 'content in second subtopic'
      },
      {
        title: 'title 2t3s',
        videoLink:
          'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley',
        content: 'content in third subtopic'
      },
      {
        title: 'title 2t4s',
        videoLink:
          'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley',
        content: 'content in fourth subtopic'
      },
      {
        title: 'title 2t5s',
        videoLink:
          'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley',
        content: 'content in fifth subtopic'
      }
    ]
  },
  {
    title: '3t',
    subtopics: [
      {
        title: 'title 3t1s',
        videoLink:
          'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley',
        content: 'content in first subtopic'
      },
      {
        title: 'title 3t2s',
        videoLink:
          'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley',
        content: 'content in second subtopic'
      }
    ]
  }
]

type topicProps = {
  title: string
  subtopics: subtopicProps[]
}

type subtopicProps = {
  title: string
  videoLink: string
  content: string
}

export function Tutorials() {
  const [currentTopic, setCurrentTopic] = useState<string>(
    navigation[0].subtopics[0].title
  )

  function convertData(navigation: topicProps[]) {
    return navigation.map((topic, index) => {
      return {
        id: index,
        title: topic.title,
        content: (
          <div className="flex flex-col text-sm font-light dark:text-text-primary pl-5 gap-y-1">
            {topic.subtopics.map((subtopic) => (
              <button
                className="cursor-pointer self-start"
                onClick={() => setCurrentTopic(subtopic.title)}
              >
                {subtopic.title}
              </button>
            ))}
          </div>
        ),
        defaultOpen: index === 0,
        action: () => {}
      }
    })
  }

  return (
    <section className="grid grid-cols-4 gap-x-6 pr-6">
      <div className="col-span-1">
        <Common.AccordionGroup accordionsData={convertData(navigation)} />
      </div>
      <div className="col-span-3">
        {navigation.map((topic) =>
          topic.subtopics.map((subtopic) => {
            if (subtopic.title === currentTopic) {
              return (
                <div key={subtopic.title} className="flex flex-col gap-y-8">
                  <div className="w-full h-[56.25%] bg-black">
                    <ReactPlayer
                      url={subtopic.videoLink}
                      width="100%"
                      height="100%"
                      controls
                    />
                  </div>
                  <div className="flex flex-col gap-y-3">
                    <p className="text-3xl dark:text-text-primary">
                      {subtopic.title}
                    </p>
                    <div className="dark:text-text-primary font-light">
                      {subtopic.content}
                    </div>
                  </div>
                </div>
              )
            }
          })
        )}
      </div>
    </section>
  )
}
