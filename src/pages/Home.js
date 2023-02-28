import React, { useEffect } from 'react';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import GroupList from '../components/GroupList';
import Friends from '../components/Friends';
import UserList from '../components/UserList';
import FriendReq from '../components/FreindReq'
import Mygroups from '../components/Mygroups';
import Blocked from '../components/Blocked';


const Home = () => {
  const auth = getAuth();
  let navigate = useNavigate();
  let data = useSelector(state => state);
 
  // if no data found from redux
  useEffect(() => {
    if(!data.userdata.userInfo){
      console.log("ganjam")
      navigate("/login")
    }
  },[]);

  return (
    <React.Fragment>
      <Grid className='grid_holder'>
        <Grid className='grid'>
          <GroupList/>
          <FriendReq/>
        </Grid>
        <Grid className='grid'>
          <Friends/>
          <Mygroups/>
        </Grid>
        <Grid className='grid'>
          <UserList/>
          <Blocked/>
        </Grid>
       </Grid>
    </React.Fragment>
  )
}

export default Home;