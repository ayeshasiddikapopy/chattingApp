import React, { useEffect,useState } from 'react'
import { BiDotsVerticalRounded } from "react-icons/bi";
import {AiOutlineCheck} from 'react-icons/ai'
import {MdDeleteForever} from 'react-icons/md'
import Image from './Image';
import Listbutton from './Listbutton';
import ListItem from './ListItem';
import { getDatabase, ref, onValue, remove, set, push} from "firebase/database";
import { useSelector } from 'react-redux';
import { styled, Button, Box ,Typography ,Modal , Alert} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';

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

//modal
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

const Mygroups = () => {
    let db = getDatabase();
    let data = useSelector(state => state)
    let [groupList, setGrouplist] = useState([]);
    let [groupRequestList, setGroupRequestList] = useState([]);
    let [groupMember , setGroupmember] = useState([]);
    //modal member request
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);

    // modal member info
    const [openInfo, setOpeninfo] = React.useState(false);
    const handleCloseInfo = () => setOpeninfo(false);

    // groups 
    useEffect ( () => {
        const mygroupRef = ref(db,'groups')
        onValue(mygroupRef, (snapshot) => {
            let arr = []
            snapshot.forEach((item) => {
                if(data.userdata.userInfo.uid == item.val().adminid ){
                    arr.push({...item.val(), groupid: item.key})
                }
            })
            setGrouplist(arr)
        })
    },[])

    //member request
    const handleOpen = (id) => {
        setOpen(true)
        console.log(id)
        const groupmemberRef = ref(db,'grouprequest')
        onValue(groupmemberRef, (snapshot) => {
            let arr = []
            snapshot.forEach((item) => {
                if(item.val().groupid == id ){
                    arr.push({...item.val(), memberid: item.key})
                }
            })
            setGroupRequestList(arr)
            console.log('loader')
            // setTimeout(()=>{
            //    console.log('lo')
            //   },500)
            // toast("member")
        })
    };

    //remove
    let handledelet = (item) => {
        remove(ref(db, 'grouprequest/' + item.memberid)).then((
            console.log("delete")
        )).then(() =>{
            console.log('removed')
        })
    }

    //group member accept
    let handleAccept = (item) => {
        console.log(item)
        set(push(ref(db , 'groupMembers')),{
            groupid: item.groupid,
            userid: item.userid,
            username: item.username,
            key: item.memberid
        }).then(() => {
            remove(ref(db,'grouprequest/' + item.memberid))
        })
    }
    
    // group Member info
    let handleInfoOpen = (id) => {
        setOpeninfo(true)
        console.log(id)
        onValue((ref(db, 'groupMembers')), (snapshot) => {
            let arr = []
            snapshot.forEach((item) => {
                if(item.val().groupid == id){
                    arr.push({...item.val() , memberid: item.key})
                }
            })
            setGroupmember(arr)   
        })
    }

  return (
    <React.Fragment>
        {/* Groups */}
        <div className='groupBox_holder'>
            <div className='box_title'>
                <ListItem title ='My Groups' className= 'Group_title' as='h2' />
                <BiDotsVerticalRounded className='box_icon'/> 
            </div>
            <div className='boxHolder'>
                {groupList.map((item) => (
                    <div className='box_list'>
                        <div className='group_box'>
                            <div className='groupImg'>
                                <Image imgsrc='../assets/groups.png' className='groupImg_item'/>
                            </div>
                        <div className='group_subTitle'>
                        <ListItem title ={item.groupname} className= 'Group_Subtitle' as='h2' />
                        <ListItem title ={item.grouptag} className= 'Group_Subtitle-lower' as='p' />
                        </div>
                        </div>
                        <div className='box_button'>
                            <Listbutton listbutton = {ListButton} title='info' onClick = {() => handleInfoOpen(item.groupid)}/>
                            <Listbutton listbutton = {ListButton} title='request' onClick={() => handleOpen(item.groupid)}/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        {/* group member request */}
        <div className='modal'>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={style}>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <ListItem title ='member request' className= 'Group_Subtitle' as='h2' />
                </Typography> 
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {groupRequestList.length > 0 ? groupRequestList.map((item) => (
                         <div className='box_list'>
                        <div className='group_box'>
                        <Image imgsrc='../assets/groups.png' />
                        <div className='group_subTitle'>
                        <ListItem title ={item.username} className= 'Group_Subtitle' as='h2' />
                        <ListItem title ='wants to join' className= 'Group_Subtitle-lower' as='p' />
                        </div>
                        </div>
                        <div className='box_button'>
                            <Link>
                                <AiOutlineCheck onClick={() => handleAccept(item)} className='modal_Item-accept'/>
                            </Link>
                            <Link>
                                <MdDeleteForever onClick={() => handledelet(item)} className='modal_Item-delet'/>
                            </Link>
                        </div>
                    </div>
                    )) 
                    : (<Alert variant="filled" severity="info" className='alert'>
                    No member request here
                    </Alert>)
                }
                </Typography>
                </Box>
            </Modal> 
        </div>

        {/* group member info / accept */}
        <div className='modal'>
            <Modal
                open={openInfo}
                onClose={handleCloseInfo}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={style}>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <ListItem title ='members' className= 'Group_Subtitle' as='h2' />
                    </Typography> 
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {groupMember.length > 0 ? groupMember.map((item) => (
                            <div className='box_list'>
                            <div className='group_box'>
                            <Image imgsrc='../assets/groups.png' />
                            <div className='group_subTitle'>
                            <ListItem title ={item.username} className= 'Group_Subtitle' as='h2' />
                            <ListItem title ='joined' className= 'Group_Subtitle-lower' as='p' />
                            </div>
                            </div>
                            <div className='box_button'>
                                <Listbutton listbutton = {ListButton} title='block' />
                            </div>
                        </div>
                        )) 
                        : (<Alert variant="filled" severity="info" className='alert'>
                        No members available
                        </Alert>)
                        }
                    </Typography>
                </Box>
            </Modal> 
        </div>

        {/* toast */}
        <ToastContainer
        position="bottom-center"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        />
    </React.Fragment>
  )
}

export default Mygroups