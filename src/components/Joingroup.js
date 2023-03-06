import React, { useState ,useEffect } from 'react';
import Image from './Image';
import Listbutton from './Listbutton';
import { styled, Button, Box ,Typography ,Modal} from '@mui/material';
import ListItem from './ListItem';
import { getDatabase, ref, onValue, remove, set, push} from "firebase/database";
import { useSelector , useDispatch} from 'react-redux';
import { toast , ToastContainer } from 'react-toastify';
import { activeChatuser } from '../slices/activeChatslice';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #676767',
    boxShadow: 24,
    p: 4,
};

const ListButton = styled(Button)({
    padding: '5px 20px',
    backgroundColor: '#5F35F5',
    borderRadius:'5px',
    fontFamily: ['Nunito','sans-serif'],
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

const Joingroup = () => {
    let db = getDatabase();
    let dispatch = useDispatch()
    let data = useSelector(state => state)
    let [groupList, setGrouplist] = useState([]);
    let [groupMember , setGroupmember] = useState([]);
    let [groupName, setGroupname] = useState(''); 
    let [groupTag, setGrouptag] = useState('');

    //create group
    let handleCreatgroup = () => {
        console.log('create')
        set(push(ref(db,'groups')),{
            groupname : groupName,
            grouptag : groupTag,
            adminid: data.userdata.userInfo.uid,
            adminname: data.userdata.userInfo.displayName,
        })
    }

    //sending group request to join 
    let handlegroupJoin = (item) => {
        set(push(ref(db,'grouprequest')),{
            groupid : item.groupid,
            groupname : item.groupname,
            userid : data.userdata.userInfo.uid,
            username : data.userdata.userInfo.displayName,
        }).then(() => {
            console.log('joined')
        })
    }

    // delet groups
    let handlegroupDelet = (item) =>{
        remove(ref(db, 'groups/' + item.groupid)).then((
            console.log("delete")
        )).then(() =>{
            console.log('unfriend')
        })
    }

    // members
    useEffect ( () => {
        onValue((ref(db,'groupMembers')), (snapshot) => {
            let arr = []
            snapshot.forEach((item) => {
              arr.push(item.val().groupid+item.val().userid)
            })
            setGroupmember(arr)
        })
    },[]);
    
    //all group list
    useEffect ( () => {
        const starCountRef = ref(db, "groups");
        onValue(starCountRef, (snapshot) => {
            let arr = []
            snapshot.forEach((item) => {
                if(data.userdata.userInfo.uid == item.val().adminid ){
                    arr.push({...item.val(), groupid: item.key})
                 }else if(groupMember.includes(item.key+data.userdata.userInfo.uid)){
                    arr.push({...item.val(), groupid: item.key})
                }
                // if(data.userdata.userInfo.uid == item.val().adminid  || groupMember.includes(item.key+data.userdata.userInfo.uid)){
                //   arr.push({...item.val(), groupid: item.key})
                // }  
            })
            setGrouplist(arr)
        })
    },[groupMember.length]);

    //group chat
    // chatting
    let handleActiveChat = (item) => {
        dispatch(activeChatuser({...item, status:'group'}))
        localStorage.setItem('activeUser', JSON.stringify(item))
    }
  
    return (
    <React.Fragment>
        <div className='groupBox_holder'>
            <div className='box_title'>
                <ListItem title ='All Groups' className= 'Group_title' as='h2' />
            </div>
            <div className='boxHolder'>
            {/* grouplist data fetching */}
            {groupList.map((item) => (
                <div className='box_list' onClick={() => handleActiveChat(item)}>
                    <div className='group_box'>
                        <div className='groupImg'>
                            <Image imgsrc='../assets/groups.png' className='groupImg_item'/>
                        </div>
                    <div className='group_subTitle'>
                        <ListItem title = {item.groupname} className = 'Group_Subtitle' as='h2' />
                        <ListItem title = {item.grouptag} className = 'Group_Subtitle-lower' as='p' />
                        <ListItem title = {item.adminname} className = 'Group_Subtitle-lower' as='h4' />
                    </div>
                    </div>
                    <div className='box_button'>
                        <Listbutton listbutton = {ListButton} title='join' onClick={() => handlegroupJoin (item)}/>
                        <Listbutton listbutton = {ListButton} title='delete' onClick={() => handlegroupDelet (item)}/>
                    </div>
                </div>
            ))}
           </div>
        </div>
    </React.Fragment>
  )
}

export default Joingroup