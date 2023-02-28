import Registration from './pages/Registration';
import {createBrowserRouter, RouterProvider, createRoutesFromElements, Route} from "react-router-dom";
import Login from './pages/Login';
import Home  from './pages/Home';
import Rootlayout from './components/Rootlayout';
import Notification from './pages/Notification';
import MesagePage from './pages/MesagePage';


// import ForgotPassword from './components/ForgotPassword';

let router = createBrowserRouter(
  createRoutesFromElements(
   <Route>
      <Route path='/' element = {<Registration/>}></Route>
      <Route path='/login' element = {<Login/>}></Route>
      <Route path='/root' element = {<Rootlayout/>}>  
        <Route index element = {<Home/>}></Route>
        <Route path='message' element={<MesagePage/>}></Route>
        <Route path='notification' element = {<Notification/>}></Route>
      </Route>
      {/* <Route path='/fgp' element = {<ForgotPassword/>}></Route> */}
   </Route>
  )
)

function App() {
  return (
    <>
      <RouterProvider router = {router}/>
    </>
  );
}

export default App;
