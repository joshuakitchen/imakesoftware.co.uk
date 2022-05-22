import React, { FC, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Routes, Route } from 'react-router'
import { BrowserRouter, Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import {
  AboutPage,
  EditPage,
  HomePage,
  LoginPage,
  NotFoundPage,
  PostListPage,
  PostPage,
} from './pages'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cx from 'classnames'
import { useLocalStorage } from './utils'

library.add(fas)

const root = createRoot(document.getElementById('react-container'))

const App: FC<{}> = function App() {
  const [{ mode }, setConfig] = useLocalStorage('config', { mode: 'day' })

  useEffect(() => {
    if (mode === 'day') {
      document.body.removeAttribute('class')
    } else {
      document.body.setAttribute('class', 'night')
    }
  }, [mode])

  return (
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
          <li className='right'>
            <ul className='menu right'>
              <li>
                <a
                  href='#'
                  onClick={(e) => {
                    e.preventDefault()
                    setConfig((config) => ({
                      ...config,
                      mode: mode === 'day' ? 'night' : 'day',
                    }))
                  }}
                >
                  <FontAwesomeIcon icon={mode === 'day' ? 'sun' : 'moon'} />
                </a>
              </li>
            </ul>
          </li>
        </ul>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/posts/' element={<PostListPage />} />
          <Route path='/posts/:post_id/' element={<PostPage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/edit/:post_id/' element={<EditPage />} />
          <Route path='/*' element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
