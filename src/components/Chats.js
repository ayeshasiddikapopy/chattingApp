import React ,{useEffect,useState}from 'react';
import { RiSendPlaneFill , RiCameraOffLine } from "react-icons/ri";
import { BsImages , BsFillEmojiLaughingFill } from "react-icons/bs";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { AiOutlineCamera , AiOutlineClose} from "react-icons/ai";
import { IoCloseCircleSharp } from "react-icons/io5";
import Image from './Image';
import ListItem from './ListItem';
import { getDatabase, ref, onValue, remove, set, push, update} from "firebase/database";
import { useSelector } from 'react-redux';
import moment from 'moment/moment';
import ScrollToBottom from 'react-scroll-to-bottom';
import { getDownloadURL, getStorage, ref as sref, uploadBytes, uploadString } from "firebase/storage";
import { Link } from '@mui/material';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import EmojiPicker from 'emoji-picker-react';
import{ Box,Button,Typography,Modal } from '@mui/material';

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

const Chats = () => {
    const storage = getStorage();
    const recorderControls = useAudioRecorder()
    let db = getDatabase()
    let data = useSelector(state => state)
    let [msg , setmsg] = useState('')
    let [messaglist , setMessagelist] = useState([]);
    let [isCamera, setisCamera] = useState(false);
    let [isAudio , setisAudio] = useState(false);
    let [isEmoji , setisEmoji] = useState(false)
    
    //modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // message object || data collection
    let handleSendmsg = () => {
        if(data.activeUser.activeChatuser.status == 'single'){
            set(push(ref(db, 'singlemsg')) , {
                whosendId: data.userdata.userInfo.uid,
                whosendName: data.userdata.userInfo.displayName,
                whoReceiveName: data.userdata.userInfo.uid == data.activeUser.activeChatuser.senderid 
                ? data.activeUser.activeChatuser.receivername
                : data.activeUser.activeChatuser.sendername,

                whoReceiveId: data.userdata.userInfo.uid == data.activeUser.activeChatuser.senderid 
                ? data.activeUser.activeChatuser.receiverid
                : data.activeUser.activeChatuser.senderid,
                msg:msg,
                date: `${new Date().getFullYear()}-${
                    new Date().getMonth() + 1
                  }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
            }).then(() => {
                setmsg('')
                //last message -->>
                update((ref(db, 'friends/' + data.activeUser.activeChatuser.blockId)),{                       
                    lastmsg:msg,
                })
            })
        }
    }

    // messaging send || recieve
    useEffect(() => {
        onValue((ref(db, 'singlemsg')), (snapshot) => {
            let arr = [];
            let id = data.activeUser.activeChatuser.receiverid == data.userdata.userInfo.uid
            ? data.activeUser.activeChatuser.senderid
            : data.activeUser.activeChatuser.receiverid ;

            snapshot.forEach((item) => {
                if((item.val().whosendId == data.userdata.userInfo.uid && item.val().whoReceiveId == id) 
                || (item.val().whosendId == id && item.val().whoReceiveId == data.userdata.userInfo.uid))
                arr.push(item.val())
            })
            setMessagelist(arr)
        });
    },[data])   

    // key press
    let handlekeypress = (e) => {
        if(e.key == "Enter"){
            if(data.activeUser.activeChatuser.status == 'single'){
                set(push(ref(db, 'singlemsg')) , {
                    whosendId: data.userdata.userInfo.uid,
                    whosendName: data.userdata.userInfo.displayName,
                    whoReceiveName: data.userdata.userInfo.uid == data.activeUser.activeChatuser.senderid 
                    ? data.activeUser.activeChatuser.receivername
                    : data.activeUser.activeChatuser.sendername,
    
                    whoReceiveId: data.userdata.userInfo.uid == data.activeUser.activeChatuser.senderid 
                    ? data.activeUser.activeChatuser.receiverid
                    : data.activeUser.activeChatuser.senderid,
                    msg:msg,
                    date: `${new Date().getFullYear()}-${
                        new Date().getMonth() + 1
                      }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
                }).then(() => {
                    setmsg('')
                    //last msg -->>
                    update((ref(db, 'friends/' + data.activeUser.activeChatuser.blockId)),{                       
                        lastmsg:msg,
                    })
                })
            }
        }
    }

    //image upload
    let handleImgUpload = (e) => {
        const storageRef = sref(storage,'singlemsgImg/'+ e.target.files[0].name);
        uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
            getDownloadURL(storageRef).then((downloadimgurl) => {
                if(data.activeUser.activeChatuser.status == 'single'){
                    set(push(ref(db, 'singlemsg')) , {
                        whosendId: data.userdata.userInfo.uid,
                        whosendName: data.userdata.userInfo.displayName,
                        whoReceiveName: data.userdata.userInfo.uid == data.activeUser.activeChatuser.senderid 
                        ? data.activeUser.activeChatuser.receivername
                        : data.activeUser.activeChatuser.sendername,
        
                        whoReceiveId: data.userdata.userInfo.uid == data.activeUser.activeChatuser.senderid 
                        ? data.activeUser.activeChatuser.receiverid
                        : data.activeUser.activeChatuser.senderid,
                        img:downloadimgurl,
                        date: `${new Date().getFullYear()}-${
                            new Date().getMonth() + 1
                          }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
                    }).then(() => {
                        setmsg('')
                    })
                }
            })
        });
    }
 
    //camera 
    function handleTakePhoto (dataUri) {
        const storageRef = sref(storage, 'singlemsg/' + Date.now());
        const message4 = dataUri;
        uploadString(storageRef, message4, 'data_url').then((snapshot) => {
            getDownloadURL(storageRef).then((downloadimgurl) => {
                if(data.activeUser.activeChatuser.status == 'single'){
                    set(push(ref(db, 'singlemsg')) , {
                        whosendId: data.userdata.userInfo.uid,
                        whosendName: data.userdata.userInfo.displayName,
                        whoReceiveName: data.userdata.userInfo.uid == data.activeUser.activeChatuser.senderid 
                        ? data.activeUser.activeChatuser.receivername
                        : data.activeUser.activeChatuser.sendername,
        
                        whoReceiveId: data.userdata.userInfo.uid == data.activeUser.activeChatuser.senderid 
                        ? data.activeUser.activeChatuser.receiverid
                        : data.activeUser.activeChatuser.senderid,
                        img:downloadimgurl,
                        date: `${new Date().getFullYear()}-${
                            new Date().getMonth() + 1
                        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
                    }).then(() => {
                       setisCamera(false)
                    })
                }
            })
        });
      }
    //   function handleTakePhotoAnimationDone (dataUri) {
    //     // Do stuff with the photo...
    //     console.log('takePhoto');
    //   }
    
    //   function handleCameraError (error) {
    //     console.log('handleCameraError', error);
    //   }
    
    //   function handleCameraStart (stream) {
    //     console.log('handleCameraStart');
    //   }
    
    //   function handleCameraStop () {
    //     console.log('handleCameraStop');
    //     setisCamera(false)
    //   }

    
   //audio
    const addAudioElement = (blob) => {
        const url = URL.createObjectURL(blob);
        const audio = document.createElement("audio");
        audio.src = url;
        audio.controls = true;
        document.body.appendChild(audio);
    }

    //emoji
    let handleEmoji = (e) => {
        setmsg(msg+e.emoji)
    }

  return (
    <React.Fragment>
        <div className='groupBoxHolder_chat'>
            <div className='chating'>
                <div className='box_title box_title-border'>
                    <div className='group_box'>
                        <div className='chatImg'>
                            <Image imgsrc='../assets/groups.png' className='chatImg_item'/>
                            <div className='online_dot'></div>
                        </div>
                        {data.userdata.userInfo.uid == data.activeUser.activeChatuser.senderid
                        ?
                        <div className='group_subTitle'>
                            <ListItem title ={data.activeUser.activeChatuser.receivername } className= 'Group_Subtitle--chat' as='h2' />
                             <ListItem title ={data.activeUser.activeChatuser.groupname} className= 'Group_Subtitle--chat' as='h2' />
                            <ListItem title ='online' className= 'Group_Subtitlelower--Chat' as='p' />
                         </div>
                        :
                        <div className='group_subTitle'>
                            <ListItem title ={data.activeUser.activeChatuser.sendername} className= 'Group_Subtitle--chat' as='h2' />
                            <ListItem title ={data.activeUser.activeChatuser.groupname} className= 'Group_Subtitle--chat' as='h2' />
                            <ListItem title ='online' className= 'Group_Subtitlelower--Chat' as='p' />
                        </div>
                        }
                       
                    </div>
                    <BiDotsVerticalRounded className='box_icon'/> 
                </div>
                <ScrollToBottom className='chatBox_item'>
                    <div className='chat_profile'>
                        <div className='chat_profileImg'>
                            <Image imgsrc='../assets/groups.png' className='chatImg_item'/>
                            <div className='online_dot'></div>
                        </div>
                        {data.userdata.userInfo.uid == data.activeUser.activeChatuser.senderid
                        ?
                        <div className='group_subTitle'>
                            <ListItem title ={data.activeUser.activeChatuser.receivername} className= 'Group_Subtitle--chat' as='h2' />
                            <ListItem title ={data.activeUser.activeChatuser.groupname} className= 'Group_Subtitle--chat' as='h2' />
                            <ListItem title ='You are friends 'className= 'Group_Subtitlelower--Chat' as='p' />
                         </div>
                        :
                        <div className='group_subTitle'>
                            <ListItem title ={data.activeUser.activeChatuser.sendername} className= 'Group_Subtitle--chat' as='h2' />
                            <ListItem title ={data.activeUser.activeChatuser.groupname} className= 'Group_Subtitle--chat' as='h2' />
                            <ListItem title ='You are friends ' className= 'Group_Subtitlelower--Chat' as='p' />
                        </div>
                        }
                    </div>
                    <div className='chat_item'>
                        {messaglist.map((item) =>(
                            item.whosendId == data.userdata.userInfo.uid 
                            ?
                            <div className='chat-inner'>
                                {item.msg 
                                ?(<div className='chat_itemText-right '>   
                                    <ListItem title ={item.msg} className= 'chat_item-sizesRight' as='p' />
                                </div> )
                                :( <div className='chat_itemText-right chat_itemImg-right'>   
                                    <Image imgsrc={item.img} className='chatImg_item'/>
                                </div>)
                                }
                                <div className='chat_itemText-right '>
                                    <p className='chat_dates'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                                </div>
                            </div>
                            :
                            <div className='chat-inner'>
                                {item.msg 
                                ?(
                                <div className='chat_itemText-left'>
                                    <ListItem title ={item.msg} className= 'chat_item-sizesLeft' as='p' />
                                </div>
                                ):( 
                                <div className='chat_itemText-left chat_itemImg-left'>   
                                    <Image imgsrc={item.img} className='chatImg_item'/>
                                </div>)
                                }  
                                <div className='chat_itemText-left '>
                                    <p className='chat_dates'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                                </div>
                            </div>
                        ))}                                               
                    </div>
                </ScrollToBottom>
                <div className='chat_send'>
                    <div className=' input_item'>
                        <input className='inputs' onChange={(e) => setmsg(e.target.value)} onKeyUp={handlekeypress} value={msg} type="text" placeholder="Message"/>
                        <div className='input_icon'>
                             <label>
                                <input type='file' onChange={handleImgUpload} hidden/>
                                <BsImages className='box_icon sticker_icon'/> 
                            </label>
                            <AiOutlineCamera onClick={() => setisCamera(true)} className='cam'/>
                            <BsFillEmojiLaughingFill className='sticker_icon' onClick={() => setisEmoji(!isEmoji)}/>

                            {isEmoji &&
                                <EmojiPicker onEmojiClick ={(e) => handleEmoji(e)}/> 
                            }
                        </div>                     
                    </div>
                     <div className='audio_btn'>
                        <button onClick={() => setisAudio(true)} >rec</button>
                    </div>
                    <div className='audio_item'>
                        {isAudio &&
                        <>
                            <AudioRecorder onRecordingComplete={(blob) => addAudioElement(blob)} recorderControls={recorderControls}/>
                            <div className='stop-recItem'>
                                <AiOutlineClose className='stop-rec' onClick={() => setisAudio(false)} />
                            </div>
                        </>
                        }   
                    </div>      
                    <div className='send' onClick={handleSendmsg}>
                       <Link><RiSendPlaneFill className='box_icon send_icon'/></Link> 
                    </div>
                </div>             
            </div>
        </div>
        {isCamera &&
            <div className='camera'>
                <Camera 
                onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
                // onTakePhotoAnimationDone = { (dataUri) => { handleTakePhotoAnimationDone(dataUri); } }
                // onCameraError = { (error) => { handleCameraError(error); } }
                idealResolution = {{width: 600, height: 480}}
                imageCompression = {0.97}
                //  isMaxResolution = {true}
                isImageMirror = {true}
                isSilentMode = {false}
                isDisplayStartCameraError = {false}
                isFullscreen = {true}
                sizeFactor = {1}
                // onCameraStart = { (stream) => { handleCameraStart(stream); } }
                //  onCameraStop = { () => { handleCameraStop(); } }
                />
                <div className='camoff_item'>
                    <IoCloseCircleSharp onClick={() => setisCamera(false)} className='camoff'/>
                </div>
            </div>
        }
    </React.Fragment>
  )
}


export default Chats;