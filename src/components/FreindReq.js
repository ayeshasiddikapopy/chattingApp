import React ,{useEffect,useState}from 'react';
import { BiDotsVerticalRounded } from "react-icons/bi";
import Image from './Image';
import Listbutton from './Listbutton';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import ListItem from './ListItem';
import { getDatabase, ref, onValue, remove, set, push} from "firebase/database";
import { useSelector } from 'react-redux';
import Alert from '@mui/material/Alert';

const ListButton = styled(Button)({
    padding: '5px 20px',
    backgroundColor: '#5F35F5',
    borderRadius:'5px',
    fontFamily:['Nunito','sans-serif'],
    fontWeight:'600',
    fontSize:'16px',
    color:'#FFFFFF',
    textTransform:'capitalize',
    margin:'0 5px',
    '&:hover': {
      backgroundColor: '#5F35F5',
      boxShadow: ' #FCFCFC',
    },
});

const FreindReq = () => {
    const db = getDatabase();
    let data = useSelector(state => state)
    let [friendrequest, setFriendrequest] = useState([])


    // sending friend request
    useEffect(()=>{
        const friendreqRef = ref(db, 'friendrequest');
        onValue(friendreqRef, (snapshot) => {
         let arr = [];
         snapshot.forEach(item => {
            if(item.val().receiverid === data.userdata.userInfo.uid){
                arr.push({...item.val(), id: item.key})
            }
         })
         setFriendrequest(arr)
        });
    },[])

    //delet
    let handlereject = (item) => {
        remove(ref(db, 'friendrequest/' + item.id)).then((
            console.log("delete")
        ))
    }

    //accept
    let handleAccept = (item) => {
        set(push(ref(db,'friends')),{
            ...item,
            date : `${new Date().getDate()} / ${new Date().getMonth()+1} / ${new Date().getFullYear()}`,
        }).then(() =>{
            remove(ref(db, 'friendrequest/' + item.id)).then((
                console.log("delete")
            ))
        })
    }

  return (
    <>
        <div className='groupBox_holder'>
            <div className='box_title'>
                <ListItem title ='Friend Request' className= 'Group_title' as='h2' />
                <BiDotsVerticalRounded className='box_icon'/> 
            </div>
            <div className='boxHolder'>
                {friendrequest.length > 0 ? friendrequest.map((item) => (
                    <div className='box_list'>
                        <div className='group_box'>
                            <div className='groupImg'>
                                <Image imgsrc='../assets/groups.png' className='groupImg_item'/>
                            </div>
                            <div className='group_subTitle'>
                                <ListItem title ={item.sendername} className= 'Group_Subtitle' as='h2' />
                                <ListItem title ='hey wassup' className= 'Group_Subtitle-lower' as='p' />
                            </div>
                        </div>
                        <div className='box_button'>
                            <Listbutton listbutton = {ListButton} title='accept' onClick = {() => handleAccept(item)}/>
                            <Listbutton listbutton = {ListButton} title='delete' onClick ={() => handlereject(item)}/>
                        </div>
                    </div>
                   ))
                   : (<Alert variant="filled" severity="info" className='alert'>
                        No friend request here
                    </Alert>)}
            </div>
        </div>
    </>
  )
}

export default FreindReq