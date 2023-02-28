import React ,{useEffect,useState}from 'react';
import Image from './Image';
import ListItem from './ListItem';
import Listbutton from './Listbutton';
import { BiDotsVerticalRounded } from "react-icons/bi";
import { styled,Button , Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import { getDatabase, ref, onValue, remove, set, push} from "firebase/database";

const ListButton = styled(Button)({
    padding: '5px 10px',
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
const ListBlocked = styled(Button)({
    padding: '5px 10px',
    backgroundColor: '#9074f2',
    borderRadius:'5px',
    fontFamily:['Nunito','sans-serif'],
    fontWeight:'600',
    fontSize:'16px',
    color:'#FFFFFF',
    margin:'0 5px',
    textTransform:'capitalize',
    '&:hover': {
      backgroundColor: '#9074f2',
      boxShadow: ' #FCFCFC',
    },
});
const Blocked = () => {
    const db = getDatabase();
    let data = useSelector(state => state)
    let [block, setBlock] = useState([]);

    //friends
    useEffect(() => {
        const blockRef = ref(db, 'block');
        onValue(blockRef, (snapshot) => {
            let arr = [];
            snapshot.forEach(item => {
                if(item.val().blockbyid === data.userdata.userInfo.uid) {
                    arr.push({ 
                        id : item.key,
                        block: item.val().block,
                        blockid:item.val().blockid
                    })
                } else if (item.val().blockid === data.userdata.userInfo.uid) {
                    arr.push({ 
                        id : item.key,
                        blockby: item.val().blockby,
                        blockbyid:item.val().blockbyid
                    })
                }
            })
            setBlock(arr)
        });
    },[]);

    //unblock
    let handleUnblock = (item) => {
        set(push(ref(db,'friends')),{
            sendername:data.userdata.userInfo.displayName,
            senderid: data.userdata.userInfo.uid,
            receivername:item.block,
            receiverid:item.blockid,
        }).then(()=>{
            remove(ref(db,'block/' + item.id)).then(()=>{
                console.log('unblocked')
            })
        })
    }

  return (
    <>
        <div className='groupBox_holder'>
            <div className='box_title'>
                <ListItem title ='Blocked Users' className= 'Group_title' as='h2' />
                <BiDotsVerticalRounded className='box_icon'/> 
            </div>
            { block.length > 0 ? block.map( (item) => (
            <div className='boxHolder'>
                <div className='box_list'>
                    <div className='group_box'>
                        <div className='groupImg'>
                            <Image imgsrc='../assets/groups.png' className='groupImg_item'/>
                        </div>
                        <div className='group_subTitle'>
                            {item.block
                            ?
                            <ListItem title ={item.block} className= 'Group_Subtitle' as='h2' />
                            :
                            <ListItem title ={item.blockby} className= 'Group_Subtitle' as='h2' />
                        }
                        <ListItem title ='who blocked' className= 'Group_Subtitle-lower' as='p' />
                        </div>
                    </div>
                    <div className='box_button'>
                        {item.block 
                        ?
                        <Listbutton listbutton = {ListButton} title='Unblock' onClick={() => handleUnblock(item)}/>
                        :
                        <Listbutton listbutton = {ListBlocked} title='Blocked'/>
                    }  
                    </div>
                </div>
            </div>
             ))
            : (<Alert variant="filled" severity="info" className='alert'>
            No blocked here
            </Alert>)
            } 
        </div>
    </>
  )
}

export default Blocked;