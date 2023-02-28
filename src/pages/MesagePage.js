import React from 'react'
import Grid from '@mui/material/Grid';
import Friends from '../components/Friends';
import Chats from '../components/Chats';
import Joingroup from '../components/Joingroup';

const MesagePage = () => {
  return (
    <React.Fragment>
        <Grid className='grid_holder'>
        <Grid className='grid'>
            <Joingroup/>
            <Friends/>
        </Grid>
        <Grid className='gridMsg'>
            <Chats/>
        </Grid>
       </Grid>
    </React.Fragment>
  )
}

export default MesagePage