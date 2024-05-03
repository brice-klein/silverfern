import { useEffect, useState } from 'react'
import { GoogleLogin, googleLogout } from '@react-oauth/google'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './App.css'

function App() {
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [list, setList] = useState([])
  const [loginBool, setLoginBool] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(()=> {
    getSetState()
  }, [])

  const getSetState = () => {
    getSetDataList()
    getSetCategories()
  } 

  const getSetDataList = () => {
    fetch('https://fakestoreapi.com/products')
    .then(res=>res.json())
    .then(json=>setDataList(json))
  }

  const setDataList = (json) => {
    setData(json)
    setList(json)
  }

  const getSetCategories = () => {
    fetch('https://fakestoreapi.com/products/categories')
            .then(res=>res.json())
            .then(json=>setCategories(json))
  }

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
    setSearchQuery(e.target.value)
    setList(data.filter((item) => item.title.includes(searchQuery)))
  } 

  const listReducer = (arr = [], element) => {
    if (!!element && !!element.title && element.title.includes(searchQuery)) {
      arr.push(element)
    }
    return arr
  }

  return (
    <>
    <header><button onClick={()=>logOut()}>logout</button><input type="text" onChange={(e)=>handleSearchInput(e)}></input></header>
      <div>    
        <h1>MOCK SHOP</h1>
        
        { loginBool ? <Pagination categories={categories} postsPerPage={10} length={list.length} items={list}/> : <GoogleLogin onSuccess={responseMessage} onError={errorMessage}></GoogleLogin> }
      </div>
    </>
  )
}

function List({items, categories}) {
  return (
    <div className="list">
      
      { items.map(
        (item) => { return (
          <Item item={item} categories={categories} key={item.id} />
          )
        }) 
      }
    </div>
  )
}

function Item({item, categories}) {
  const [showEdit, setEdit] = useState(false)
  if (!showEdit) {
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
        <div className="item-footer"><button onClick={()=>setEdit(true)}>Edit</button></div>
      </div>
    </>
    )
  } else {
    return (
      <>
        <form>
          <label for="itemTitle">Item Title</label><br></br>
          <input type="text" id="itemTitle" name="itemTitle"></input><br></br>
          <label for="itemDescription">Item Description</label><br></br>
          <label for="itemCategory">Item Category</label>
          <select id="itemCategory" name="itemCategory">
            { categories.map(
              (category) => { return (
              <option value={category} key={category}>{category}</option>
              )}
              )
            }
          </select>
        </form>
      </>
    )
  }
}

function Pagination({postsPerPage, length, items, categories}) {
  
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
        <List categories={categories} items={items.slice(pageNumber*10 - 10, pageNumber*10)} page={1} />
        {paginationNumbers.map((pageNum) => (<button onClick={()=>setPageNumber(pageNum)} key={pageNum}>{pageNum}</button>))}
      </div>
    )
}
export default App
