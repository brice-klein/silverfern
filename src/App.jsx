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
  const [itemTitle, setItemTitle] = useState(item.title)
  const [itemDescription, setItemDescription] = useState(item.description)
  const [itemCategory, setItemCategory] = useState(item.category)
  const [itemPrice, setItemPrice] = useState(item.price)
  const [itemImage, setItemImage] = useState(item.image)

  const validateText = (sample) => {
    return typeof sample == "string"
  }

  const validateNumber = (sample) => {
    var r = /^\$?[0-9]+\.?[0-9]?[0-9]?$/;
    return r.test(sample)
  }

  const validateURL = (sample) => {
    var r = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i
    return r.test(sample)
  }

  const trimDollarSign = (sample) => {
    if (sample[0] == "$") {
      return parseFloat(sample.slice(1))
    } else {
      return parseFloat(sample)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (validateText(itemTitle) 
        && validateText(itemDescription) 
        && validateText(itemCategory) 
        && validateNumber(itemPrice)
        && validateURL(itemImage)
      ) {
        fetch('https://fakestoreapi.com/products/' + item.id,{
            method:"PUT",
            body:JSON.stringify(
                {
                    title: itemTitle,
                    price: 13.5,
                    description: itemDescription,
                    image: trimDollarSign,
                    category: itemCategory
                }
            )
        })
            .then(res=>res.json())
            .then(json=>console.log(json))
        setEdit(false)
    }
  }

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
        <form onSubmit={(e) => handleSubmit(e)}>
          <label for="itemTitle">Item Title</label><br></br>
          <input type="text" id="itemTitle" name="itemTitle" placeholder={itemTitle} onChange={(e) => setItemTitle(e.target.value)}></input><br></br>
          <label for="itemDescription">Item Description</label><br></br>
          <textarea rows="4" col="50" id="itemDescription" name="itemDescription" placeholder={itemDescription} onChange={(e) => setItemDescription(e.target.value)}></textarea><br></br>
          <label for="itemCategory">Item Category</label><br></br>
          <select id="itemCategory" name="itemCategory" placeholder={itemCategory} onChange={(e) => setItemCategory(e.target.value)}>
            { categories.map(
              (category) => { return (
              <option value={category} key={category}>{category}</option>
              )}
              )
            }
          </select><br></br>
          <label for="itemPrice">Item Price</label><br></br>
          <input type="text" id="itemPrice" name="itemPrice" placeholder={itemPrice} onChange={(e) => setItemPrice(e.target.value)}></input><br></br>
          <label for="itemImage">Item Image URL</label><br></br>
          <input type="text" id="itemImage" name="itemImage" placeholder={itemImage} onChange={(e) => setItemImage(e.target.value)}></input>
          <input type="submit" value="Submit"></input>
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
