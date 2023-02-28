import React , {useEffect, useState} from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {Link} from 'react-router-dom'
import { useSelector , useDispatch} from 'react-redux';
import { AiOutlineHome, AiFillSetting } from "react-icons/ai";
import { BsFillChatDotsFill } from "react-icons/bs";
import { RiFolderSharedLine } from "react-icons/ri";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Grid, Box, Button ,Typography ,Modal ,styled} from '@mui/material';
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Listbutton from './Listbutton';
import Image from './Image';
import { activeUser } from '../slices/userSlices';
import { activeChatuser } from '../slices/activeChatslice';

// mui button
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

const Uploadbtn = styled(Button)({
  padding: '5px 13px',
  backgroundColor: '#5F35F5',
  borderRadius:'5px',
  fontFamily:['Nunito','sans-serif'],
  fontWeight:'600',
  fontSize:'20px',
  color:'#FFFFFF',
  margin:'0 5px',
  textTransform:'capitalize',
  '&:hover': {
    backgroundColor: '#5F35F5',
    boxShadow: ' #FCFCFC',
  },
});

//croper img
// const defaultSrc =
//   "https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg";

const Rootlayout = () => {
  const auth = getAuth();
  let navigate = useNavigate();
  // data from redux start
  let data = useSelector((state)=> state);
  let dispatch = useDispatch();
  // data from redux end
  //modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //croper login image
  const [image, setImage] = useState();
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();
  const [profile, setProfile] = useState(" ");

  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result );  // browser  readble data 
    };
    reader.readAsDataURL(files[0]);
  };

  //storage 
  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      const storage = getStorage();
      const storageRef = ref(storage,`profilImg/ ${data.userdata.userInfo.uid}`);
      const message4 = cropper.getCroppedCanvas().toDataURL();

      uploadString(storageRef, message4, 'data_url').then((snapshot) => {
      setOpen(false);
      setImage("");
        getDownloadURL(storageRef).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL
          }).then(() => {   // photo url null problem solution-->>
            dispatch(activeUser(auth.currentUser))
            localStorage.setItem("userInfo", JSON.stringify(auth.currentUser))
          })
        })
      })
    }
  }

 // reloading login img-->>
  useEffect(()=>{
    setProfile(data.userdata.userInfo.photoURL)
  },[data])

  // logout start
  let handlelogOut = () => {
    signOut(auth).then(() => {
      localStorage.clear("userInfo") // remove from local storage
      dispatch(activeUser(null)) // remove from redux
      navigate("/login")
    })
  }
  // logout end
  
  let handlehome = () => {
  //   dispatch(activeChatuser( {
  //     sendername: 'popy',
  //     senderid: 'uui',
  //     receivername:'hkjh',
  //     receiverid:'jhjhjk',
  // }))
  // localStorage.clear("activeUser")  // userdata null after reloading home page 
  // dispatch(activeChatuser('')) 
  }
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={1}>
          <div className='sidebarbox'>
            <div className='sidebar'>
                <div className='img_holder'>
                  {image ?
                    <div className='img-preview'>
                      
                    </div> 
                    :
                    data.userdata.userInfo.photoURL 
                      ?
                      <Link><Image imgsrc={profile} onClick={handleOpen} className='current_image'/></Link>
                      :
                      <Link><Image imgsrc='../assets/login_img.png' className='current_image' onClick={handleOpen}/></Link>
                  }
                </div>
                <div>
                  <div className='loginName'>
                    <h5 className='loginName_item'>{data.userdata.userInfo.displayName}</h5>
                  </div>
                </div>
                <div className='icon_holder'>
                    <Link to='/root'>
                      <AiOutlineHome className='icon' onClick={handlehome}/>
                    </Link>
                    <Link to='/root/message'>
                      <BsFillChatDotsFill className='icon'/>
                    </Link>
                    <Link>
                      <IoIosNotificationsOutline className='icon'/>
                    </Link>
                    <Link>
                    <AiFillSetting className='icon'/></Link>
                    
                </div>
                <div className='file_icon'>
                  <Link>
                    <RiFolderSharedLine className='icon' onClick={handlelogOut} />
                  </Link>
                </div>
            </div>
          </div>
          <div>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                <div className='img_holder'>
               
                  {image 
                  ?
                  <div className='img-preview'></div> 
                  :
                  data.userdata.userInfo.photoURL 
                    ?
                      <Link><Image imgsrc={data.userdata.userInfo.photoURL} className='current_image' onClick={handleOpen}/></Link>
                    :
                      <Link><Image imgsrc='../assets/login_img.png' className='current_image' onClick={handleOpen}/></Link>
                  }
                </div>
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <input type='file' onChange={onChange}/>
                  {image && 
                  <>
                  <Cropper
                    style={{ height: 400, width: "100%" }}
                    zoomTo={0.5}
                    initialAspectRatio={1}
                    preview=".img-preview"
                    src={image}
                    viewMode={1}
                    minCropBoxHeight={10}
                    minCropBoxWidth={10}
                    background={false}
                    responsive={true}
                    autoCropArea={1}
                    checkOrientation={false} 
                    onInitialized={(instance) => {
                      setCropper(instance);
                    }}
                    guides={true}
                  />
                  <div className='box_button'>
                      <Listbutton listbutton = {Uploadbtn} title='upload' onClick={getCropData}/>
                  </div>
                  </>
                  }
                </Typography>
              </Box>
            </Modal>
          </div>
        </Grid> 
        <Outlet/>
      </Grid>
    </React.Fragment>
  )
}

export default Rootlayout;