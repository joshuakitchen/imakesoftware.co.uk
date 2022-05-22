import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import React, { FC, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { Portal, useLocalStorage, useUser } from '../utils'

const PostPage: FC<{}> = function () {
  const user = useUser()
  const { post_id } = useParams()
  const [state, setState] = useLocalStorage(`post-${post_id}`, {
    title: '',
    content: '',
  })

  useEffect(function _PostPageEffect() {
    axios.get(`/api/posts/${post_id}/`).then((res) => {
      setState((state) => ({ ...res.data }))
    })
  }, [])

  let editButton
  if (user) {
    editButton = (
      <Portal>
        <Link className='edit' to={`/edit/${post_id}/`}>
          <Icon icon='feather-pointed' fixedWidth />
        </Link>
      </Portal>
    )
  }

  return (
    <div className='content'>
      <h1>{state.title}</h1>
      <ReactMarkdown>{state.content}</ReactMarkdown>
      {editButton}
    </div>
  )
}

export default PostPage
