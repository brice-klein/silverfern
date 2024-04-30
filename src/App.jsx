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
        <List items={data} />
        <Pagination postsPerPage={10} length={data.length}/>
      </div>
    </>
  )
}

function List({items}) {
  return (
    <div className="list">
      
      { items.map(
        (item) => { return (
          <Item item={item} />
          )
        }) 
      }
    </div>
  )
}

function Item({item}) {
  return (
    <>
      <div className="item-container">
        <div className="header">
          <div className="image-container">
            <img className="item-image" src={item.image}></img>
          </div>
          <div className="item-title">
            {item.title}
          </div>
        </div>

        <div className="item-description">
          {item.description}
        </div>
      </div>
    </>
  )
}

function Pagination({postsPerPage, length}) {
  const paginationNumbers = [] 
  
    for (let i = 1; i <= Math.ceil(length / postsPerPage); i++) {
      paginationNumbers.push(i)
    }

    return (
      <div className="pagination">
        {paginationNumbers.map((pageNumber) => (<button key={pageNumber}>{pageNumber}</button>))}
      </div>
    )
}
export default App
