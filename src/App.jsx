import { useEffect, useState } from 'react'
import { GoogleLogin, googleLogout } from '@react-oauth/google'

import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [list, setList] = useState([])
  const [loginBool, setLoginBool] = useState(false)

  useEffect(()=> {
    fetch('https://fakestoreapi.com/products').then(res=>res.json()).then(json=>setData(json))
  }, [])

  const responseMessage = (response) => {
      setLoginBool(true)
      console.log(response);
  };
  const errorMessage = (error) => {
      console.log(error);
  };

  const logOut = () => {
    googleLogout();
  }

  const handleSearchInput = (e) => {
    setList(data.filter((item) => item.title.includes(e.target.value)))
  } 

  return (
    <>
    <header><button onClick={()=>logOut()}>logout</button><input type="text" onChange={(e)=>handleSearchInput(e)}></input></header>
      <div>    
        <h1>MOCK SHOP</h1>
        
        { loginBool ? <Pagination postsPerPage={10} length={list.length} items={list.map((item) => searchQuery.length > 0 ? item.title.includes(searchQuery) : item)}/> : <GoogleLogin onSuccess={responseMessage} onError={errorMessage}></GoogleLogin> }
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
            <h3>{item.title}</h3>
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
