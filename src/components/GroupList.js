import React, { useState ,useEffect } from 'react';
import Image from './Image';
import Listbutton from './Listbutton';
import { styled, Button, Box ,Typography ,Modal} from '@mui/material';
import ListItem from './ListItem';
import InputBox from './InputBox';
import { getDatabase, ref, onValue, remove, set, push} from "firebase/database";
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

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

const GroupList = () => {
    let db = getDatabase();
    let data = useSelector(state => state)
    let [groupName, setGroupname] = useState(''); // [] hobe, how?
    let [groupTag, setGrouptag] = useState('');
    let [groupList, setGrouplist] = useState([]);
    let [groupreq , setgroupreq] = useState([]);
    let [groupMember , setGroupmember] = useState([]);
    //modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    //create group
    let handleCreatgroup = () => {
        set(push(ref(db,'groups')),{
            groupname : groupName,
            grouptag : groupTag,
            adminid: data.userdata.userInfo.uid,
            adminname: data.userdata.userInfo.displayName,
        }).then(()=>{
            setOpen(false)
        })
    }

    // grouplist
    useEffect ( () => {
        const mygroupRef = ref(db,'groups')
        onValue(mygroupRef, (snapshot) => {
            let arr = []
            snapshot.forEach((item) => {
                if(data.userdata.userInfo.uid !== item.val().adminid ){
                    arr.push({...item.val(), groupid: item.key})
                    // arr.push(item.val().id)
                }
            })
            setGrouplist(arr)
        })
    },[]);

    //group join data collection/ group request
    let handlegroupJoin = (item) => {
        set(push(ref(db,'grouprequest')),{
            groupid : item.groupid,
            groupname : item.groupname,
            userid : data.userdata.userInfo.uid,
            username : data.userdata.userInfo.displayName,
        }).then(() => {
            toast("join request sent")
        })
        console.log(item)
    }

    //grouprequest
    useEffect (() => {
        const mygroupRef = ref(db,'grouprequest')
        onValue(mygroupRef, (snapshot) => {
            let arr = []
            snapshot.forEach((item) => {
                if(data.userdata.userInfo.uid == item.val().userid){
                    //arr.push({...item.val(), groupid: item.key})
                    arr.push(item.val().groupid)
                }
            })
            setgroupreq(arr)
        })
    },[]);

    // delelet 
    let handlegroupDelet = (item) =>{
        remove(ref(db, 'groups/' + item.groupid)).then((
            console.log("delete")
        )).then(() =>{
            console.log('unfriend')
        })
    }

    //member  
    useEffect(() => {
        onValue((ref(db, 'groupMembers')), (snapshot) => {
            let arr = []
            snapshot.forEach((item) => {
                if(item.val().userid == data.userdata.userInfo.uid){
                   arr.push(item.val().groupid)
                }
            })
            setGroupmember(arr)   
        })
    },[])
    
    //cancel request
    let handleCancle = (item) => {
       console.log(item)
       remove(ref(db, 'grouprequest/' + item.groupid))
    }
  
  return (
    <React.Fragment>
        <div className='groupBox_holder'>
            <div className='box_title'>
                <ListItem title ='Group List' className= 'Group_title' as='h2' />
                <div className='box_button'>
                    <Listbutton listbutton = {ListButton} title='create group' onClick={handleOpen}/>
                </div>
            </div>
            <div className='boxHolder'>

            {groupList.map((item) => (
                <div className='box_list'>
                    <div className='group_box'>
                        <div className='groupImg'>
                            <Image imgsrc='../assets/groups.png' className='groupImg_item'/>
                        </div>
                        <div className='group_subTitle'>
                            <ListItem title = {item.groupname} className = 'Group_Subtitle' as='h2' />
                            <ListItem title = {item.grouptag} className = 'Group_Subtitle-lower' as='p' />
                            <ListItem title = {item.adminname} className = 'Group_Subtitle-lower' as='p' />
                        </div>
                    </div>

                    { groupreq.length > 0 && groupreq.includes(item.groupid) 
                    ? (
                        <div className='box_button'>                     
                            <Listbutton listbutton = {ListButton} title='pending' />
                            <Listbutton listbutton = {ListButton} title='cancel' onClick={() => handleCancle(item)} />
                        </div>
                    ) 
                    : groupMember.length > 0 &&  groupMember.includes(item.groupid) 
                    ? ( 
                        <div className='box_button'>                     
                            <Listbutton listbutton = {ListButton} title='joined' />
                        </div>
                    ):(
                    <div className='box_button'>
                        <Listbutton listbutton = {ListButton} title='join' onClick={() => handlegroupJoin (item)}/>
                        <Listbutton listbutton = {ListButton} title='delete' onClick={() => handlegroupDelet (item)}/>
                    </div>
                    )
                    }
                </div>
            ))}
           </div>
        </div>
        <div className='modal'>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    <InputBox  name="text" className='reginput' label="group name" variant='filled' textChange = {(e) => setGroupname(e.target.value)}/>
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <InputBox  name="text" className='reginput' label="group tag" variant='filled' textChange = {(e) => setGrouptag(e.target.value)}/>
                </Typography>
                <div className='modal__btn'>
                    <Listbutton listbutton = {ListButton} title='create' onClick = {handleCreatgroup}/>
                </div>
                </Box>
            </Modal> 
        </div>
    </React.Fragment>
  )
}

export default GroupList;