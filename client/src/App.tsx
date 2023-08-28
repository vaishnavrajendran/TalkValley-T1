import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import SignInPage from "./screens/SignInPage";
import { useAppSelector } from "./store/store";
import HomePage from "./screens/HomePage";

const App = () => {
  const isVerified = useAppSelector(state => state.person.userInfo)
  
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isVerified ? <HomePage/> : <SignInPage/>}/>
          <Route path="/home" element={isVerified ? <HomePage/> : <SignInPage/>} />
          <Route path="*" element={<Navigate to={isVerified ? "/home" : '/'} />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App