import { useState } from 'react'
import axios from 'axios';

function App() {
  const [isAuth, setIsAuth] = useState(false) // 預設值為 false
  const [account, setAccount] = useState({
    username: "example@test.com",
    password: "example"
  })

  const handleInputChange = (e) => {
    const { value, name } = e.target; // 解構賦值出 username 和 password 的 value & name
  // setAccount 完整的寫法
  // setAccount({
  //   username: "example@test.com",
  //   password: "example"
  // })

  // setAccount 縮寫
    setAccount({
      ...account, // 帶入 username 與 password
      [name]: value
      // username: value // 這樣寫也可以 (如果是 password 的話就是 password: value 或 )
    })
  }

  const handleLogin = (e) => {
    e.preventDefault(); // NOTE：透過表單觸發 submit 事件要記得使用 event.preventDefault() 取消 form 表單的預設行為
    // console.log(account); 
    // console.log(import.meta.env.VITE_BASE_URL);
    // console.log(import.meta.env.VITE_API_PATH);
    axios.post(`${import.meta.env.VITE_BASE_URL}/v2/admin/signin`, account) 
      .then((res) => {
        const { token, expired } = res.data;
        console.log(token, expired);
        document.cookie = `hexToken=${token}; expires=${new Data (expired).toUTCString()}; path=/`; // 將 token 存到 cookie 中，我們這邊把它命名為 hexToken，並設定到 cookie 中的過期時間為 expired
        setIsAuth(true);
      })
      .catch((error)=> alert('登入失敗'))
  }

  // console.log(account) // 用 console.log 來檢視 account 資訊的變化

  return (
    <>
      {isAuth ? <p>loggedin</p> : <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h1 className="mb-5">請先登入</h1>
        <form onSubmit={handleLogin} className="d-flex flex-column gap-3"> {/* 一般 onSubmit 事件都是綁定在 form 表單上而不是 button 元素上，雖然也可行 */}
          <div className="form-floating mb-3">
            <input name="username" value={account.username} onChange={handleInputChange} type="email" className="form-control" id="username" placeholder="name@example.com" /> {/* 設定 input value 為 account.username；記得設定完 value 後還要綁定 onChange, 這樣 input 的值才會隨著 input 輸入的值更新 */}
            <label htmlFor="username">Email address</label>
          </div>
          <div className="form-floating">
            <input name="password" value={account.password} onChange={handleInputChange} type="password" className="form-control" id="password" placeholder="Password" /> {/* 設定 input value 為 account.password；；記得設定完 value 後還要綁定 onChange, 這樣 input 的值才會隨著 input 輸入的值更新*/}
            <label htmlFor="password">Password</label>
          </div>
          <button className="btn btn-primary">登入</button>
        </form>
        <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
    </div>}
    </>
  )
}

export default App
