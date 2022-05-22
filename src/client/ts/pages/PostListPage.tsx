import axios from 'axios'
import React, { FC, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Portal, useLocalStorage, useUser } from '../utils'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'

const PostListPage: FC<{}> = function (props) {
  const user = useUser()
  const [state, setState] = useLocalStorage('posts', { data: [] })

  useEffect(function _PostListPageEffect() {
    axios.get('/api/posts/').then((res) => {
      setState((state) => ({ ...res.data }))
    })
  }, [])

  let newPost = null
  if (user) {
    newPost = (
      <Portal>
        <Link className='edit' to={'/edit/new/'}>
          <Icon icon='feather-pointed' fixedWidth />
        </Link>
      </Portal>
    )
  }

  return (
    <div className='content'>
      <h1>Post List</h1>
      {state.data.map((item) => {
        return (
          <p key={item.id}>
            <Link to={`/posts/${item.id}/`}>{item.title}</Link>
          </p>
        )
      })}
      {newPost}
    </div>
  )
}

export default PostListPage
