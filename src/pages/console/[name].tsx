import * as consoleSection from 'domains/console'
import cookie from 'cookie'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Home({
  cookie
}: {
  cookie: { admin_access_token?: string }
}) {
  return (
    <>
      <consoleSection.SchemaManagerProvider>
        <consoleSection.ConsoleEditorProvider>
          <consoleSection.SidebarProvider>
            <consoleSection.UserProvider>
              {/* {!cookie.admin_access_token ? (
                <consoleSection.AdminLogin />
              ) : ( */}
              <Page />
              {/* )} */}
            </consoleSection.UserProvider>
          </consoleSection.SidebarProvider>
        </consoleSection.ConsoleEditorProvider>
      </consoleSection.SchemaManagerProvider>
    </>
  )
}

function Page() {
  const router = useRouter()
  const { name } = router.query

  let formattedName = ''
  if (typeof name === 'string') {
    formattedName = name?.charAt(0).toUpperCase() + name?.slice(1)
  }

  return (
    <>
      <Head>
        <title>{formattedName} - Console</title>
      </Head>
      <consoleSection.ViewConsole />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (props) => {
  const cookies = cookie.parse(props.req.headers.cookie as string)
  return {
    props: {
      cookie: cookies
    }
  }
}
