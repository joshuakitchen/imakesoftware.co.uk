import axios from 'axios'
import React, { FC, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Navigate, useNavigate, useParams } from 'react-router'
import { Portal, useUser } from '../utils'

const EditPage: FC<{}> = function EditPage() {
  const user = useUser()
  const { post_id } = useParams()
  const [state, setState] = useState({ title: 'New Post', content: '' })
  const navigate = useNavigate()

  if (!user) {
    return <Navigate to='/' />
  }

  if (post_id !== 'new') {
    useEffect(() => {
      axios.get(`/api/posts/${post_id}/`).then(function _onPostGet(res) {
        setState((state) => ({
          ...state,
          title: res.data.title,
          content: res.data.content,
        }))
      })
    }, [])
  }

  return (
    <>
      <Portal>
        <div className='edit-window'>
          <input
            placeholder='Title'
            onChange={(e) => {
              setState((state) => ({ ...state, title: e.target.value }))
            }}
            value={state.title}
          />
          <textarea
            onChange={(e) => {
              setState((state) => ({ ...state, content: e.target.value }))
            }}
            value={state.content}
          />
          <button
            onClick={(e) => {
              e.preventDefault()

              if (post_id === 'new') {
                axios
                  .post('/api/posts/', {
                    title: state.title,
                    content: state.content,
                  })
                  .then((res) => {
                    navigate(`/posts/${res.data.id}/`)
                  })
              } else {
                axios
                  .patch(`/api/posts/${post_id}`, {
                    title: state.title,
                    content: state.content,
                  })
                  .then((res) => {
                    navigate(`/posts/${res.data.id}/`)
                  })
              }
            }}
          >
            Submit
          </button>
        </div>
      </Portal>
      <div className='content'>
        <h1>{state.title}</h1>
        <ReactMarkdown>{state.content}</ReactMarkdown>
      </div>
    </>
  )
}

export default EditPage
