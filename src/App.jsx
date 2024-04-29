import { useEffect, useState } from 'react'

import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState([])
  useEffect(()=> {
    fetch('https://fakestoreapi.com/products').then(res=>res.json()).then(json=>setData(json))

  })

  return (
    <>
      <div>
      </div>
    </>
  )
}

function Item({item}) {
  return (
    <>
      <div class="item-container">
        <div class="item-title">
          {item.title}
        </div>
        <div class="item-description">
          {item.description}
        </div>
      </div>
    </>
  )
}
export default App
