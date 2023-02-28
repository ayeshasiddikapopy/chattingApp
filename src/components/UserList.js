import React, { useEffect, useState } from 'react';
import Image from './Image';
import Listbutton from './Listbutton';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import ListItem from './ListItem';
import { getDatabase, ref, onValue, set,push, remove} from "firebase/database";
import { useSelector } from 'react-redux';
import InputBox from './InputBox';


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

const UserList = () => {
    const db = getDatabase();
    let data = useSelector(state => state);
    let [userList, setUserlist] = useState([]);  
    let [friendrequest, setFriendrequest] = useState([]);
    let [friends, setFriends] = useState([]);
    let [searchList, setSearchlist] = useState([]);
    
    // get data from redux (data fetching)
    useEffect(() => {
        const userRef = ref(db, 'users/');
        onValue(userRef, (snapshot) => {
            let arr = [];
            snapshot.forEach(item => {
                if(data.userdata.userInfo.uid !== item.key){
                    // arr.push(item.val())
                    arr.push({...item.val(), id:item.key})
                }
            })
            setUserlist(arr)
        });
    },[]);

    // send friendreq
    let handlefriendreq = (info) =>{
        set(push(ref(db,'friendrequest')),{
            sendername:data.userdata.userInfo.displayName,
            senderid: data.userdata.userInfo.uid,
            receivername:info.displayName,
            receiverid:info.id,
        })
    }

    // pending
    useEffect(() => {
        const pendingRef = ref(db, 'friendrequest');
        onValue(pendingRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
            arr.push(item.val().receiverid + item.val().senderid )
            // arr.push({...item.val(), id: item.key} )
            })
            setFriendrequest(arr)
        });
    },[]);

    //cancel friend request
    let handleCanclefriends = (item) => {
        remove(ref(db, 'friendrequest' + item.id)).then((
            console.log("delete" ,item.id )
        )).then(() =>{
            console.log('unfriend')
        })
    }

    //cancel problem
    let handleCancle = (item) =>{
        remove(ref(db, 'friends/' + item.id)).then((
            console.log("delete", item.id)
        ))
        console.log(item)
    }

    //after accepting friends
    useEffect(() => {
        const friendRef = ref(db, 'friends');
        onValue(friendRef, (snapshot) => {
            let arr = [];
            snapshot.forEach(item => {
                arr.push(item.val().receiverid + item.val().senderid )
                //arr.push({...item.val(), id: item.key} )
            })
            setFriends(arr)
        });
    },[]);

    // search
    let handleSeach = (e) => {
        let arr = []
        userList.filter((item) => {
            if(item.displayName.toLowerCase().includes(e.target.value.toLowerCase())){
                arr.push(item)
            }
        })
        setSearchlist(arr)
    }
 
  return (
    <>
        <div className='groupBox_holder'>
            <div className='box_title'>
                <ListItem title ='User List' className= 'Group_title' as='h2' />
                <InputBox  name="text" className='search' label="Search" variant='filled' textChange = {handleSeach}/>
            </div>
            <div className='boxHolder'>
                {searchList.length < 1 
                ?
                userList.map(item=>(
                    <div className='box_list'>
                        <div className='group_box'>
                            <div className='groupImg'>
                                <Image imgsrc='../assets/groups.png' className='groupImg_item'/>
                            </div>
                            <div className='group_subTitle'>
                                <ListItem title ={item.displayName} className= 'Group_Subtitle' as='h2' />
                                <ListItem title ={item.email} className= 'Group_Subtitle-lower' as='p' />
                            </div>
                        </div>
                        {/* friends--> */}
                        {
                        friends.includes(item.id + data.userdata.userInfo.uid) || friends.includes(data.userdata.userInfo.uid + item.id) 
                        ? 
                        (
                            <div className='friends'>
                            <Listbutton listbutton = {ListButton} title='friends' />
                             <Listbutton listbutton = {ListButton} title='cancel' onClick= {() => handleCancle (item)}/>
                            </div>
                        )
                        :
                        friendrequest.includes(item.id + data.userdata.userInfo.uid) || friendrequest.includes(data.userdata.userInfo.uid + item.id) 
                        ? (
                            <div className='box_button'>
                                <Listbutton listbutton = {ListButton} title='pending' />
                                <Listbutton listbutton = {ListButton} onClick={() => handleCanclefriends(item)} title='cancel' />
                            </div>)
                           :
                           (
                           <div className='box_button'>
                                <Listbutton listbutton = {ListButton} title='send request' onClick={()=> handlefriendreq(item)}/>
                            </div>) 
                        }
                    </div>
                ))
                :
                searchList.map(item=>(
                    <div className='box_list'>
                        <div className='group_box'>
                            <Image imgsrc='../assets/groups.png' />
                            <div className='group_subTitle'>
                                <ListItem title ={item.displayName} className= 'Group_Subtitle' as='h2' />
                                <ListItem title ={item.email} className= 'Group_Subtitle-lower' as='p' />
                            </div>
                        </div>
                        {/* friends--> */}
                        {
                        friends.includes(item.id + data.userdata.userInfo.uid) || friends.includes(data.userdata.userInfo.uid + item.id) 
                        ? 
                        (<Listbutton listbutton = {ListButton} title='friends' />)
                        :
                        
                        friendrequest.includes(item.id + data.userdata.userInfo.uid) || friendrequest.includes(data.userdata.userInfo.uid + item.id) 
                        ? (
                            <div className='box_button'>
                                <Listbutton listbutton = {ListButton} title='pending' />
                            </div>)
                           :
                           (
                           <div className='box_button'>
                                <Listbutton listbutton = {ListButton} title='send request' onClick={()=> handlefriendreq(item)}/>
                            </div>) 
                        }
                    </div>
                ))
                }
            </div>
        </div>
    </>
  )
}

export default UserList