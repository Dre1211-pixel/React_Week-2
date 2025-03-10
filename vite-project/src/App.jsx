import { useState } from 'react'
import axios from 'axios'

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "test886";

function App() {
  const [account, setAccount] = useState({
    "username": "example@test.com",
    "password": "example"
  })

  const [isAuth,setIsAuth] = useState(false);
  const [tempProduct, setTempProduct] = useState({});
  const [products,setProducts] = useState([]); 

  async function checkLogin() {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("hexToken="))
        ?.split("=")[1];
      console.log(token);
      axios.defaults.headers.common.Authorization = token;

      const res = await axios.post(`${API_BASE}/api/user/check`);
      console.log(res);
    } catch (error) {
      console.error(err);
    }
  }

  const getProducts = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products`
      );
      setProducts(response.data.products);
    } catch (err) {
      console.error(err.response.data.message);
    }
  };

  const handleInputChange =(e)=>{ 
    const {value,name}=e.target;
      setAccount({
      ...account,
      [name]:value
      })
    // console.log(account);
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, account);
      const { token, expired } = response.data;
      document.cookie = `AwesomeToken=${token}; expires=${new Date(expired)}`;
      
      axios.defaults.headers.common['Authorization'] = token;

      getProducts();  
      
      setIsAuth(true);
      console.log(response);
    } catch (error) {
      alert("登入失敗：" + error.response.data.message);
    }
  };

  const checkUserLogin = () => {
    axios.post(`${API_BASE}/api/user/check`)
      .then((res) => alert('使用者登入成功'))
      .catch((err) => console.error(err)
    )
  }

  return (
    <>
      {isAuth ? <div className="container">
      <div className="row mt-5">
        <div className="col-md-6">
          <button onClick={checkUserLogin} className = "btn btn-success mb-5" type="button">檢查使用者是否登入</button>
          <h2>即將上映</h2>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">產品名稱</th>
                <th scope="col">原價</th>
                <th scope="col">售價</th>
                <th scope="col">是否啟用</th>
                <th scope="col">查看細節</th>
                <th scope="col">啟用狀態</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <th scope="row">{product.title}</th>
                  <td>{product.origin_price}</td>
                  <td>{product.price}</td>
                  <td>{product.is_enabled ? (<span className="text-success">已啟用</span>) : <span className="text-danger">未啟用</span>}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => setTempProduct(product)}
                    >
                      查看細節
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        const updatedProducts = products.map((p) =>
                          p.id === product.id
                            ? { ...p, is_enabled: !p.is_enabled }
                            : p
                        );
                        setProducts(updatedProducts);
                      }}
                    >
                      轉換啟用狀態
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-md-6">
          <h2>電影介紹</h2>
          {tempProduct.title ? (
            <div className="card mb-3">
              <img
                src={tempProduct.imageUrl}
                className="card-img-top border-rounded primary-image"
                alt={tempProduct.title}
              />
              <div className="card-body">
                <h5 className="card-title">
                  {tempProduct.title}
                  <span className="badge text-bg-primary ms-2">
                    {tempProduct.category}
                  </span>
                </h5>
                <p className="card-text">{tempProduct.description}</p>
                <p className="card-text">{tempProduct.content}</p>
                <p className="card-text">
                  <del>{tempProduct.origin_price} 元</del> / {tempProduct.price}{" "}
                  元
                </p>
                <h5 className="mt-3">更多圖片：</h5>
                {tempProduct.imagesUrl?.map((image) => (image && (<img key={image} src={image} className="object-fit-cover border-rounded w-25 me-2" />)))}
              </div>
            </div>
          ) : (
            <p>請選擇一個商品查看</p>
          )}
        </div>
      </div>
    </div> : (<div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h1 className="mb-5">請先登入</h1>
        <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
          <div className="form-floating mb-3">
            <input onChange={handleInputChange} name="username" value={account.username} type="email" className="form-control" id="username" placeholder="name@example.com" />
            <label htmlFor="username">Email address</label>
          </div>
          <div className="form-floating">
            <input onChange={handleInputChange} name="password" value={account.password} type="password" className="form-control" id="password" placeholder="Password" />
            <label htmlFor="password">Password</label>
          </div>
          <button className="btn btn-primary">登入</button>
        </form>
        <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
      </div>)}
    </>
  )
}

export default App
