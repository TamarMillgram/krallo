import React, { useEffect, useState } from 'react'
import { Loader } from '../loader'
import { utilService } from '../../services/util.service'
import { useSelector } from 'react-redux'

export default function PhotosList({ onUpdateBoardBg, resultsAmount, returnSize }) {
  const [imgs, setImgs] = useState([])
  useEffect(() => {
    const amount = resultsAmount ? resultsAmount : 30
    const fetchImgs = async () => {
      const response = await fetch(
        `https://api.unsplash.com/photos?&page=${utilService.getRandomIntInclusive(
          1,
          1000
        )}&per_page=${amount}&query=pattern&client_id=hjp37zjNt0WQ1s8R1MB8eXIvk5PNQigrRyOXgijwwT8`
      )
      // const response = await fetch(`https://api.unsplash.com/photos?&page=${utilService.getRandomIntInclusive(1, 1000)}&per_page=30&query=pattern&client_id=${process.env.REACT_APP_UNSPLASH_API_KEY}`)
      const data = await response.json()
      setImgs(data)
    }
    fetchImgs()
  }, [])

  function onSetBoardBg(img, ev) {
    let url = img.urls.full
    if (returnSize) url = img.urls[returnSize]
    ev.stopPropagation()
    onUpdateBoardBg(url)
  }

  return (
    <>
      {!imgs ? (
        <div>
          <Loader />
        </div>
      ) : (
        <ul className="photos-list clean-list">
          {imgs.map((img, idx) => (
            <li key={idx} className="flex justify-center column" onClick={(ev) => onSetBoardBg(img, ev)}>
              <div className="bg-img" style={{ background: `url(${img.urls.small}) center center / cover` }}>
                <a href={img.user.portfolio_url} target="_blank">
                  {img.user.username}
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}