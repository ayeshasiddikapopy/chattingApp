import React ,{useEffect,useState}from 'react';
import { RiSendPlaneFill } from "react-icons/ri";
import { BsImages } from "react-icons/bs";
import { BiDotsVerticalRounded } from "react-icons/bi";
import Image from './Image';
import ListItem from './ListItem';
import { getDatabase, ref, onValue, remove, set, push} from "firebase/database";
import { useSelector } from 'react-redux';
import moment from 'moment/moment';
import ScrollToBottom from 'react-scroll-to-bottom';
import { getStorage, ref as sref, uploadBytes } from "firebase/storage";
 

const Chats = () => {
    const storage = getStorage();
    let db = getDatabase()
    let data = useSelector(state => state)
    let [msg , setmsg] = useState('')
    let [messaglist , setMessagelist] = useState([])

    // message object // data collection
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
            })
        }
    }

    // messaging send / recieve
    useEffect(() => {
        onValue((ref(db, 'singlemsg')), (snapshot) => {
            let arr = [];
            let id = data.activeUser.activeChatuser.receiverid == data.userdata.userInfo.uid
            ? data.activeUser.activeChatuser.senderid
            : data.activeUser.activeChatuser.receiverid

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
                })
            }
        }
    }

    //image upload
    let handleImgUpload = (e) => {
        console.log(e.target.files[0])
        const storageRef = sref(storage,'singlemsgImg/'+ e.target.files[0].name);
        uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        });
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
                            <ListItem title ='online' className= 'Group_Subtitlelower--Chat' as='p' />
                         </div>
                        :
                        <div className='group_subTitle'>
                            <ListItem title ={data.activeUser.activeChatuser.sendername} className= 'Group_Subtitle--chat' as='h2' />
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
                            <ListItem title ='You are friends 'className= 'Group_Subtitlelower--Chat' as='p' />
                         </div>
                        :
                        <div className='group_subTitle'>
                            <ListItem title ={data.activeUser.activeChatuser.sendername} className= 'Group_Subtitle--chat' as='h2' />
                            <ListItem title ='You are friends ' className= 'Group_Subtitlelower--Chat' as='p' />
                        </div>
                        }
                    </div>
                    <div className='chat_item'>
                        {messaglist.map((item) =>(
                            item.whosendId == data.userdata.userInfo.uid 
                            ?
                            <div className='chat-inner'>
                                <div className='chat_itemText-right '>   
                                    <ListItem title ={item.msg} className= 'chat_item-sizesRight' as='p' />
                                </div> 
                                <div className='chat_itemText-right '>
                                    <p className='chat_dates'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                                </div>
                            </div>
                            :
                            <div className='chat-inner'>
                                <div className='chat_itemText-left'>
                                    <ListItem title ={item.msg} className= 'chat_item-sizesLeft' as='p' />
                                </div>
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
                        </div>
                    </div>
                    <div className='send' onClick={handleSendmsg}>
                        <RiSendPlaneFill className='box_icon send_icon'/>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
  )
}


export default Chats;