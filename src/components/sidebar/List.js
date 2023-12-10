import { ArrowBack, Assessment, Dashboard,Storage, PermDataSetting ,RestorePage,FileCopy} from '@material-ui/icons';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

 export const DBList = ( ) => {
  const navigate = useNavigate();
  const [firstTab, setfirstTab] = useState(null);
  const handleTabClick = (index) => {
    if(index === 0 ){
    return  navigate("/");
    }
    setfirstTab(index);
  };

   const handleClickDB1  = (index) => {

      if(index === 0 ) {
       return  setfirstTab(null);
      }

      if(index === 1 ){
        return navigate('/admin/users')
      }
      if(index === 2 ){
        return navigate('/admin/products')
      }
   }

   const handleClickDB2  = (index) => {

    if(index === 0 ) {
     return  setfirstTab(null);
    }

    if(index === 1 ){
      return navigate('/admin/products/db2')
    }

 }



 const handleClickPage_fetching  = (index) => {

  if(index === 0 ) {
   return  setfirstTab(null);
  }

  if(index === 1 ){
    return navigate('/admin/page_fetching')
  }

}
const DBList1 = () => {

  return (
      <Box
        sx={{ width:  250 ,}}
        role="presentation"


      >
        <List>
          {['...Back', 'Users(admin)', 'Products'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton  onClick={() => handleClickDB1(index)}>
                <ListItemIcon style={{color:"white"}}>
                  {index === 0 && <ArrowBack  /> }
                  {index === 1 &&  <PermDataSetting />}
                  {index === 2 &&  <Assessment  />}
                </ListItemIcon>
                <ListItemText primary={text} />

              </ListItemButton>
            </ListItem>

          ))}
        </List>

      </Box>
    );}
const DBList2 = ( ) => {

  return (
    <Box
    sx={{ width:  250 }}
    role="presentation"

  >
    <List>
      {['...Back','Product'].map((text, index) => (
        <ListItem key={text} disablePadding>
          <ListItemButton  onClick={() => handleClickDB2(index)}>
            <ListItemIcon style={{color:"white"}}>
              {index === 0 && <ArrowBack /> }
              {index === 1 && <Assessment/>}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>

        </ListItem>

      ))}
    </List>

  </Box>
    );
}

const Page_fetching = ( ) => {

  return (
    <Box
    sx={{ width:  250 }}
    role="presentation"

  >
    <List>
      {['...Back','Fetching'].map((text, index) => (
        <ListItem key={text} disablePadding>
          <ListItemButton  onClick={() => handleClickPage_fetching(index)}>
            <ListItemIcon style={{color:"white"}}>
              {index === 0 && <ArrowBack /> }
              {index === 1 && <FileCopy/>}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>

        </ListItem>

      ))}
    </List>

  </Box>
    );
}
    return (
        <Box
          sx={{ width:  250 }}
          role="presentation"

        >

          <List>
            {['Dashboard', 'DataBase1(our)', 'DataBase2','Page Fetching'].map((text, index) => (
              <ListItem key={text} disablePadding>
              {!firstTab &&  <ListItemButton onClick={() => handleTabClick(index)}>
                  <ListItemIcon style={{color:"white"}}>
                    {index === 0 && <Dashboard /> }
                    {index === 1 && <Storage />}
                    {index === 2 && <Storage/>}
                    {index === 3 && <RestorePage/>}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>}


           </ListItem>
           ))}

           {firstTab === 1 && DBList1()}
           {firstTab === 2 && DBList2()}
           {firstTab === 3 && Page_fetching()}
          </List>

        </Box>
      );
}
