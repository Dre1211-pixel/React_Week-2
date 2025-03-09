import { useState } from 'react'
import axios from 'axios'
function App() {
  const [tempProduct, setTempProduct] = useState({}); // 抓取 tempProduct 的值 & 將其預設值設為一個空物件
  const [products, setProducts] = useState([]); // 抓取 products 的值 & 將其預設值設為一個空陣列
  const [isAuth, setIsAuth] = useState(false); // 預設為 false，登入成功後改為 true
  const [account, setAccount] = useState({ // 設定 account 的預設值
      username: "example@test.com",
      password: "example"
    })

  const handleInputChange = (e) => {
    // console.log(e.target.value); // 印出目前 email 欄位的值
    // console.log(e.target.name); // 印出目前 password 欄位的值
    const { value, name } = e.target; // 解構出目前 email 欄位的值與 password 欄位的值

    setAccount({
      ...account, // 傳入目前的 account；等同於直接傳入 {username: "example@test.com", password: "example"}
      [name]: value // name === "username" || name === "password" ; 這邊設定完後就可以編輯 email 欄位的值或 password 欄位的值
    })
  }

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault(); // 移除「神秘事件」的預設行為，不然我們只能用 click 「登入」按鈕來觸發登入
    // console.log(account); // 印出目前的 account 來檢驗編輯的值是否有正確回傳
    // console.log(import.meta.env.VITE_API_PATH); // 印出 VITE_API_PATH
    // console.log(import.meta.env.VITE_BASE_URL); // 印出 VITE_BASE_URL
    
    console.log("API URL:", import.meta.env.VITE_BASE_URL);

    axios.post(`${import.meta.env.VITE_BASE_URL}/v2/admin/signin`, account) // axios.post 就是代表按下登入按鈕之後會觸發的行為
      .then(res => {
        const { token, expired } = res.data;
        console.log(token, expired);

        document.cookie = `AweSometoken=${token}; expires=${new Date(expired)};`;

        axios.defaults.headers.common['Authorization'] = token;
        
        axios.get(`${import.meta.env.VITE_BASE_URL}/v2/api/${import.meta.env.VITE_API_PATH}/admin/products`)
          .then((res)=> setProducts(res.data.products))
          .then(() => console.log(products))
          .catch((error)=> console.log(error)); 
        
        setIsAuth(true);
      })
      .catch((error) => {
        alert('登入失敗')
        console.log("Network Error:", error);
      });
  }

  return (
    <>
      {isAuth ? <div className="container">
        <div className="row mt-5">
            <div className="col-md-6">
                <h2>產品列表</h2>
                <table className="table">
                    <thead>
                    <tr>
                        <th>產品名稱</th>
                        <th>原價</th>
                        <th>售價</th>
                        <th>是否啟用</th>
                        <th>查看細節</th>
                        <th>轉換啟用</th>
                    </tr>
                    </thead>
                    <tbody>
                        {products.map((item) => (
                            <tr key={item.id} >
                                <td>{item.title}</td>
                                <td>{item.origin_price}</td>
                                <td>{item.price}</td>
                                <td className={item.is_enabled ? "text-success" : "text-danger"}>
                                    {item.is_enabled ? "啟用" : "未啟用"}
                                </td>
                                <td>
                                <button className={`btn btn-primary ${item.is_enabled ? "": "disabled"}`} onClick={() => setTempProduct(item)}>查看細節</button>
                                </td>
                                <td>
                                <button className="btn btn-primary" onClick={() => {
                                        const updatedProducts = products.map(p => 
                                            p.id === item.id ? { ...p, is_enabled: !p.is_enabled } : p
                                        );
                                        setProducts(updatedProducts);
                                    }}>轉換啟用狀態</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="col-md-6">
                <h2>單一產品細節</h2>
                {tempProduct ? (
                  <div className="card mb-3">
                      <img src={ tempProduct.imageUrl } className="card-img-top primary-image" alt="主圖" />
                      <div className="card-body">
                          <h5 className="card-title">
                              { tempProduct.title }
                              <span className="badge bg-primary ms-2">{ tempProduct.category }</span>
                          </h5>
                          <p className="card-text">商品描述：{ tempProduct.description }</p>
                          <p className="card-text">商品內容：{ tempProduct.content }</p>
                          <div className="d-flex">
                          <p className="card-text text-secondary"><del>{ tempProduct.origin_price }</del></p>
                          元 / { tempProduct.unit } 元
                      </div>
                      <h5 className="mt-3">更多圖片：</h5>
                      <div className="d-flex flex-wrap">
                          { tempProduct.imageUrl.map((url, index) => (
                              <img key={index} src={url} className="images" />
                          ))}
                      </div>
                  </div>
              </div>
              ) : (
                  <p className="text-secondary">請選擇一個商品查看</p>
              )}
            </div>
        </div>
    </div> : <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h1 className="mb-5">請先登入</h1>
        <form onSubmit={handleLogin} className="d-flex flex-column gap-3"> {/* 一般情況下，比較常見的情況是給 form 添加 onSubmit 來觸發登入而不是給 button 添加 onClick，button 就維持神秘事件，不加 type="button" 也不加 onClick */}
          <div className="form-floating mb-3">
            <input name="username" value={account.username} onChange={handleInputChange} type="email" className="form-control" id="username" placeholder="name@example.com" />
            <label htmlFor="username">Email address</label>
          </div>
          <div className="form-floating">
            <input name="password" value={account.password} onChange={handleInputChange} type="password" className="form-control" id="password" placeholder="Password" />
            <label htmlFor="password">Password</label>
          </div>
          <button className="btn btn-primary">登入</button> {/* 為了讓我們可以用 enter 來觸發登入，我們不能給這個按鈕添加 type="button", 俗稱「神秘事件」，但是我們要把「神秘事件」的預設行為在 handleLogin 裡面用 e.preventDefault() 解除掉！ */}
        </form>
        <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
      </div>}
    </>
  )
}

export default App
