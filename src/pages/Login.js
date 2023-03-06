import React, {useState}from 'react'
import Header from '../components/Header'
import Heading from '../components/Heading'
import Grid from '@mui/material/Grid';
import Image from '../components/Image';
import InputBox from '../components/InputBox';
import Buttons from '../components/Buttons';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Authentication from '../components/Authentication';
import { getAuth, signInWithEmailAndPassword ,signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail} from "firebase/auth";
import { AiFillEye,AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { activeUser } from '../slices/userSlices';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Triangle } from  'react-loader-spinner';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

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


const Login = () => {
  
  let auth = getAuth();
  let navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  let dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  let [show, setShow] = useState(false);
  let [loader, setLoader] = useState(false);
 
  let [formData, setFormData] = useState({
    email : '',
    password : '',
    fgp: ''
  });

  let [error, seterror] = useState({
    email : '',
    password : ''
  })
  let [inp,setInp] = useState('')


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
      }
      //lower
      if(!lower.test(value)){
        seterror({...error, password: "one lower letter required"})
        return
      }
      //number
      if(!num.test(value)){
        seterror({...error, password: "one number required"})
        return
      }
      //symbol
      if(!symbol.test(value)){
        seterror({...error, password: "symbol required"})
        return
      }
    }
    //value
    if(value.length < 8){
      seterror({...error, password: "minimum 8 character required"})
      return
    }
    setFormData({...formData, [name]:value})
    seterror({...error, [name]: ""})
  }

  //authentication
  let handleClick = () => {  
    setLoader(true)
    signInWithEmailAndPassword(auth, formData.email, formData.password)
    .then((userCredential) => {
      
      dispatch(activeUser(userCredential.user))  // redux
      localStorage.setItem("userInfo", JSON.stringify(userCredential.user)) // save a copy to local storage
      
      if(userCredential.user.emailVerified){
        // setFormData('')
        toast("varified")
        setLoader(false)
        setTimeout(()=>{
         navigate("/root")
        },500)
      }else {
        toast("varify your email")
      }
    }).then(()=> {
      setLoader(false)
      setInp('')
    })
    .catch((error) => {
      const errorCode = error.code;
      if(errorCode.includes('auth/user-not-found')){
        seterror({...error, email:'user not found'})
        toast("user not found !")
      } else if(errorCode.includes('auth/wrong-password')){
        seterror({...error, password:'wrong password'})
        toast("wrong password !")
      }
    });
  }

  //google
  let handleGoogle = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
      console.log("google done")
    })
  }

  //forgot password
  let handlefgp = () => {
    sendPasswordResetEmail(auth, formData.fgp)
    .then(() => {
      console.log('mail sent')
    })
  }

    return (
        <React.Fragment>
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
            theme="colored"
          />
            <Grid item xs={6}>
              <div className='regleftSide'>
                <div>
                  <Header>
                    <Heading title="Get started with easily register" className= "heading" as = "h1"/>
                    <Image onClick = {handleGoogle} className='google__img' imgsrc='assets/google.png' />
                  </Header>
                  <div className='inputContainer'>
                    <InputBox textChange={handleForm} name="email" className='reginput' label="email Address" variant='standard' value={inp}/>
                    {/* <InputBox textChange={handleForm} name="password" className='reginput' label="password" variant='standard' /> */}
                    <div style={{width:'100%', position:'relative'}}>
                      <InputBox type = {show ? "text" : "password"} textChange = {handleForm} name = 'password' className='reginput' label="password" variant='standard' value={inp}/>
                      {show
                      ?
                      <AiFillEye onClick={() => setShow(false)} className='eyeicon'/>
                      :
                      <AiFillEyeInvisible onClick={() => setShow(true)} className='eyeicon'/>
                      }
                      </div>
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
                    <Buttons click = {handleClick} bname = {CommonButton} title='Login to Continue'/>
                    }

                    <Authentication className='reglink' title='Don’t have an account ?  ' href='/' hreftitle='Sign up'/>
                   
                    <Button onClick={handleOpen} className='reglinkForgot'>Forgot password ? click here</Button>
                   
                  </div>
                </div> 
              </div>
            </Grid>
            <Grid item xs={6}>
              <Image imgsrc='assets/login.png' className='registration__img'/>
            </Grid>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Forgot Password
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <InputBox textChange={handleForm} name="fgp" className='reginput' label="email Address" variant='standard' />
                <Buttons click = {handlefgp} bname = {CommonButton} title='send email'/>
                </Typography>
              </Box>
            </Modal>
          </Grid> 
        </React.Fragment>
      )
}

export default Login