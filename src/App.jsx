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
        <Pagination postsPerPage={10} length={data.length} items={data}/>
      </div>
    </>
  )
}

function List({items}) {
  return (
    <div className="list">
      
      { items.map(
        (item) => { return (
          <Item item={item} key={item.id} />
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

function Pagination({postsPerPage, length, items}) {
  
  const paginationNumbers = [] 
  var [pageNumber, setPageNumber] = useState(1)

  const handlePageChange = (page)=> {
    setPageNumber(page)
  }

    for (let i = 1; i <= Math.ceil(length / postsPerPage); i++) {
      paginationNumbers.push(i)
    }

    return (
      <div className="pagination">
        <List items={items.slice(pageNumber*10 - 10, pageNumber*10)} page={1} />
        {paginationNumbers.map((pageNum) => (<button onClick={()=>setPageNumber(pageNum)} key={pageNum}>{pageNum}</button>))}
      </div>
    )
}
export default App
