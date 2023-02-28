import React, { useState } from 'react'
import Header from '../components/Header'
import Heading from '../components/Heading'
import Grid from '@mui/material/Grid';
import Image from '../components/Image';
import InputBox from '../components/InputBox';
import Buttons from '../components/Buttons';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Authentication from '../components/Authentication';
import Alert from '@mui/material/Alert';
import { AiFillEye,AiFillEyeInvisible } from "react-icons/ai";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification ,updateProfile } from "firebase/auth";
import LinearProgress from '@mui/material/LinearProgress';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Triangle } from  'react-loader-spinner';
import { getDatabase , set , ref} from "firebase/database";



const CommonButton = styled(Button)({
  width:'100%',
  padding: '19px 12px',
  backgroundColor: '#5F35F5',
  borderRadius:'86px',
  marginTop:'56px',
  fontFamily:['Nunito','sans-serif'],
  fontWeight:'600',
  fontSize:'20.64px',
  color:'#FFFFFF',
  textTransform:'capitalize',
  '&:hover': {
    backgroundColor: '#5F35F5',
    boxShadow: ' #FCFCFC',
  },
});


const Registration = () => {

  const db = getDatabase();
  const auth = getAuth();
  let navigate = useNavigate()

  let [formData, setFormData] = useState({ email : '',fullName : '',password : ''});
  let [error, seterror] = useState({email : '',fullName : '',password : ''})
  let [show, setShow] = useState(false);
  let [progress , setProgress] = useState(0);
  let [loader, setLoader] = useState(false);


  let handleForm = (e) => {
    let {name, value} = e.target;

    if(name === "password"){

      let capitalizes = /[A-Z]/
      let lower = /[a-z]/
      let num = /[0-9]/
      let symbol = /[<>()[\]\\.,;:\s@"$`~!$%^&*_?/^]/

      //capitalize
      if(!capitalizes.test(value)){
        seterror({...error, password: "one capitale letter required"})
        return
      }else{
        if(progress < 100){
          setProgress(progress + 20)
        }
      }
      //lower
      if(!lower.test(value)){
        seterror({...error, password: "one lower letter required"})
        return
      }else{
        if(progress < 100){
          setProgress(progress+20)
        }
      }
      //number
      if(!num.test(value)){
        seterror({...error, password: "one number required"})
        return
      }else{
        if(progress < 100){
          setProgress(progress+20)
        }
      }
      //symbol
      if(!symbol.test(value)){
        seterror({...error, password: "symbol required"})
        return
      }else{
        if(progress < 100){
          setProgress(progress+20)
        }
      }
   
    //strength
    if(value.length < 8){
      seterror({...error, password: "minimum 8 character required"})
      return
    }else{
        if(progress < 100){
          setProgress(progress + 20)
        }
       }
    }
    
    setFormData({...formData, [name]:value})
    seterror({...error, [name]: ""})


    // console.log(formData)   
  //  if(e.target.name === 'email'){
  //     setFormData({...formData , email:e.target.value})
  //     console.log(formData)
  //  }
  //  if(e.target.name === 'fullName'){
  //   setFormData({...formData , fullName:e.target.value})
  //   console.log(formData)
  //   }
  //   if(e.target.name === 'password'){
  //     setFormData({...formData , password:e.target.value})
  //     console.log(formData)
  //   }
  }
  let handleClick = () =>{
    setLoader(true)
      let expression =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ;

      if(formData.email === '') {
        seterror({...error, email: "email required"})
      }else if(!expression.test(formData.email)){
        seterror({...error, email: "valid email required"})
        console.log('valide email require')
      }else if(formData.fullName === '') {
        seterror({...error, fullName: "name required"})
      }else if(formData.password === '') {
        seterror({...error, password: "pass required"})
      }else{
        createUserWithEmailAndPassword(auth, formData.email,formData.password).then((user) => {
          sendEmailVerification(auth.currentUser)
          .then(() =>{
            updateProfile(auth.currentUser, {
              displayName: formData.fullName
            })
            .then(()=>{
              set(ref(db, 'users/' + user.user.uid), {       // realtime database working-->
              displayName : user.user.displayName,
              email: user.user.email        
              });
              }).then(() => {
                setLoader(false)
                toast("Registration succes")
                setFormData('') //from faka hoie jabe
                setTimeout(()=>{
                  navigate("/login") 
                },2000)
            })
          })
        }).catch((error) => {
          const errorCode = error.code;
          
          if(errorCode.includes("auth/email-already-in-use")){
            seterror({...error, email: "email already exists"})
          }
        });
      } 
  }


  return (
    <>
<Grid container spacing={2}>
    <ToastContainer
    position="bottom-center"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
    />
  <Grid item xs={6}>
    <div className='regleftSide'>
       <div>
        <Header>
          <Heading title="Get started with easily register" className= "heading" as = "h1"/>
          <p className="regSubHeading">Free register and you can enjoy it</p>
        </Header>
        <div className='inputContainer'>
          <InputBox type = 'email' textChange = {handleForm} name = 'email' className='reginput' label="email Address" variant='outlined' />
           {error.email &&
            <Alert className='error' variant="filled" severity="error">
                {error.email}
            </Alert>
           }
          <InputBox type = 'text' textChange = {handleForm} name = 'fullName' className='reginput' label="Full Name" variant='outlined' />
          {error.fullName &&
            <Alert className='error' variant="filled" severity="error">
                {error.fullName}
            </Alert>
           }
           <div style={{width:'100%', position:'relative'}}>
          <InputBox type = {show ? "text" : "password"} textChange = {handleForm} name = 'password' className='reginput' label="password" variant='outlined' />
          {show
          ?
          <AiFillEye onClick={() => setShow(false)} className='eyeicon'/>
          :
          <AiFillEyeInvisible onClick={() => setShow(true)} className='eyeicon'/>
          }
          <LinearProgress variant="determinate" value={progress} className = 'progress'/>
          </div>
          {error.password &&
            <Alert className='error' variant="filled" severity="error">
                {error.password}
            </Alert>
           }
          {loader ?
          <div className='traiangle'>
          <Triangle
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible={true}
          margin='0 40px'
          /></div>
          :
          <Buttons click = {handleClick} bname = {CommonButton} title='sign up'/>
          }
          <Authentication className='reglink' title='Already  have an account ? ' href='/login' hreftitle='Sign In'/>
        </div>
       </div> 
    </div>
  </Grid>
  <Grid item xs={6}>
    <Image imgsrc='assets/regi.png' className='registration__img'/>
  </Grid>
  </Grid> 
    </>
  )
}

export default Registration;