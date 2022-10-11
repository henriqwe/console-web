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
          <ul className="space-y-2 border-l-2 border-slate-100 dark:border-slate-700/80 lg:mt-4 lg:space-y-4 lg:border-slate-200">
            {topic.subtopics.map((subtopic) => (
              <li className="relative">
                <button
                  className={`flex w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full
                  ${
                    currentTopic === subtopic.title
                      ? 'font-semibold text-sky-500 before:bg-sky-500'
                      : 'text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300'
                  }`}
                  onClick={() => setCurrentTopic(subtopic.title)}
                >
                  {subtopic.title}
                </button>
              </li>
            ))}
          </ul>
        ),
        defaultOpen: index === 0,
        action: () => {}
      }
    })
  }

  return (
    <section className="grid grid-cols-4 gap-x-6 pr-6 py-10">
      <div className="col-span-1">
        <Common.AccordionGroup
          style="docs"
          gap="gap-y-3"
          accordionsData={convertData(navigation)}
        />
      </div>
      <div className="col-span-3">
        {navigation.map((topic) =>
          topic.subtopics.map((subtopic) => {
            if (subtopic.title === currentTopic) {
              return (
                <div key={subtopic.title} className="flex flex-col gap-y-8">
                  <div className="w-full h-[56.25%] object-cover bg-black">
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
