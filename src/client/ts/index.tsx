import React, { FC, SetStateAction, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Routes, Route, useParams } from 'react-router'
import { BrowserRouter, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import axios, { AxiosResponse } from 'axios'

const root = createRoot(document.getElementById('react-container'))

const useLocalStorage = function useLocalStorage<S>(
  key: string,
  initial_state: S
): [S, React.Dispatch<SetStateAction<S>>] {
  if (localStorage.getItem(key)) {
    initial_state = JSON.parse(localStorage.getItem(key))
  }
  const [state, setState] = useState(initial_state)
  return [
    state,
    function setLocalStorage(arg: S | ((prevState: S) => S)) {
      if (typeof arg === 'function') {
        setState((prevState) => {
          const newState = (arg as Function)(prevState)
          localStorage.setItem(key, JSON.stringify(newState))
          return newState
        })
      } else {
        localStorage.setItem(key, JSON.stringify(arg))
        setState.apply(this, arguments)
      }
    },
  ]
}

const PostPage: FC<{}> = function () {
  const { post_id } = useParams()
  const [state, setState] = useLocalStorage(`post-${post_id}`, { content: '' })

  useEffect(function _PostPageEffect() {
    axios.get(`/api/posts/${post_id}/`).then((res) => {
      setState((state) => ({ ...res.data }))
    })
  }, [])

  return (
    <div className='content'>
      <ReactMarkdown>{state.content}</ReactMarkdown>
    </div>
  )
}

const PostListPage: FC<{}> = function (props) {
  const [state, setState] = useLocalStorage('posts', { data: [] })

  useEffect(function _PostListPageEffect() {
    axios.get('/api/posts/').then((res) => {
      setState((state) => ({ ...res.data }))
    })
  }, [])

  return (
    <div className='content'>
      <h1>Post List</h1>
      {state.data.map((item) => {
        return (
          <p>
            <Link to={`/posts/${item.id}/`}>{item.title}</Link>
          </p>
        )
      })}
    </div>
  )
}

const HomePage = function () {
  return (
    <div className='content'>
      <h1>What is imakesoftware</h1>
      <p>Hello, my name is Josh.</p>
      <p>
        This is my project website, where I take you through the random projects
        which I work on extensively and passionately for about a day and then
        forget about and throw away.
      </p>
      <p>
        You may have noticed this looks unbelievably simple, the fact it's got
        TypeScript, React, SASS, a node backend and is dockerised should tell
        you exactly the kind of nutjob you're dealing with here.
      </p>
      <p>
        This will not be an organised website but a cacophany of chaos creating
        project after project after project which will ultimately result in none
        of them being finished and all of them being a little bit shit.
      </p>
    </div>
  )
}

const AboutPage: FC<{}> = function AboutPage() {
  return (
    <div className='content'>
      <h1>About Me</h1>
      <p>
        I have no idea why you're trying to learn about who I am, but here goes
        whacko.
      </p>
      <p>I'm Josh, I'm 26 and I'm a Senior Software Developer.</p>
      <p>
        I like making websites, software and all other things a nerd might
        create.
      </p>
      <p>
        Email: <a href='mailto:joshiemoto@gmail.com'>joshiemoto@gmail.com</a>
      </p>
    </div>
  )
}

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <div className='container'>
        <ul className='menu'>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/posts'>Posts</Link>
          </li>
          <li>
            <Link to='/about'>About Me</Link>
          </li>
        </ul>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/posts/' element={<PostListPage />} />
          <Route path='/posts/:post_id/' element={<PostPage />} />
          <Route path='/about' element={<AboutPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>
)
