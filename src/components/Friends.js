import React ,{useEffect,useState}from 'react';
import { BiDotsVerticalRounded } from "react-icons/bi";
import Image from './Image';
import Listbutton from './Listbutton';
import { styled ,Button ,Alert } from '@mui/material';
import ListItem from './ListItem';
import { getDatabase, ref, onValue, remove, set, push} from "firebase/database";
import { useSelector , useDispatch} from 'react-redux';
import { toast , ToastContainer } from 'react-toastify';
import { activeChatuser } from '../slices/activeChatslice';

const ListButton = styled(Button)({
    padding: '5px 13px',
    backgroundColor: '#5F35F5',
    borderRadius:'5px',
    fontFamily:['Nunito','sans-serif'],
    fontWeight:'600',
    fontSize:'16px',
    color:'#FFFFFF',
    margin:'0 5px',
    textTransform:'capitalize',
    '&:hover': {
      backgroundColor: '#5F35F5',
      boxShadow: ' #FCFCFC',
    },
});
const Friends = () => {
    const db = getDatabase();
    let data = useSelector(state => state)
    let dispatch = useDispatch()
    let [friends, setFriends] = useState([]);

    //friends
    useEffect(() => {
        const friendRef = ref(db, 'friends');
        onValue(friendRef, (snapshot) => {
            let arr = [];
            snapshot.forEach(item => {
                if(data.userdata.userInfo.uid == item.val().receiverid || data.userdata.userInfo.uid == item.val().senderid)  {
                arr.push({...item.val(), blockId : item.key})
                }
            })
            setFriends(arr)
        });
    },[]);

    //block
    let handleBlock = (item) =>{
        console.log(item)
        if(data.userdata.userInfo.uid == item.senderid){
            set(push(ref(db, 'block')), {
                block: item.receivername,
                blockid: item.receiverid,
                blockby:item.sendername,
                blockbyid: item.senderid,
            }).then(()=>{
                remove(ref(db,'friends/' + item.blockId)).then(()=>{
                    console.log('delet')
                })
            })
        } else {
            set(push(ref(db, 'block')), {
                block: item.sendername,
                blockid: item.senderid,
                blockby:item.receivername,
                blockbyid: item.receiverid,
            }).then(()=>{
                remove(ref(db,'friends/' + item.blockId)).then(()=>{
                    console.log('delet')
                })
            })
        }  
    }

    // unfriend
    let handleUnfriend = (item) => {
        remove(ref(db, 'friends/' + item.blockId)).then((
            console.log("delete")
        )).then(() =>{
           toast('unfriend')
        })
    }

    // chatting
    let handleActiveChat = (item) => {
        dispatch(activeChatuser({...item, status:'single'}))
        localStorage.setItem('activeUser', JSON.stringify(item))
    }

  return (
    <React.Fragment>
        <div className='groupBox_holder'>
            <div className='box_title'>
                <ListItem title ='Friends' className= 'Group_title' as='h2' />
                <BiDotsVerticalRounded className='box_icon'/> 
            </div>
            <div className='boxHolder'>
                 {friends.length > 0 ? friends.map((item) =>(
                <div className='box_list' onClick={() => handleActiveChat(item)}>
                    <div className='group_box'>
                            <div className='groupImg'>
                                <Image imgsrc='../assets/groups.png' className='groupImg_item'/>
                            </div>
                        <div className='group_subTitle'>
                            {item.receiverid == data.userdata.userInfo.uid
                            ?
                            <ListItem title ={item.sendername} className= 'Group_Subtitle' as='h2' />
                            :
                            <ListItem title ={item.receivername} className= 'Group_Subtitle' as='h2' />
                            }
                            <ListItem title ={item.date} className= 'Group_Subtitle-lower' as='p' />
                        </div>
                    </div>
                    <div className='box_button'>
                        <Listbutton listbutton = {ListButton} title='Block' onClick={()=>handleBlock(item)}/>
                        <Listbutton listbutton = {ListButton} title='Unfriend' onClick ={() => handleUnfriend(item)}/>
                    </div>
                </div>
                )):
                (<Alert variant="filled" severity="info" className='alert'>
                No friends available 
                </Alert>)
            }
            </div>
        </div>
    </React.Fragment>
  )
}

export default Friends;