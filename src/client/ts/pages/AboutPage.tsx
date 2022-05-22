import React, { FC } from 'react'

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

export default AboutPage
