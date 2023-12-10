
import React from 'react';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
//add new user ,product,user and new product
export const ResultNotify = ({result}) => {

  return (
    <div>
      { result === "ok" &&  <p> Uploaded Successfully!</p>}
      { result === "error" &&  <p>  Not Uploaded Successfully!</p>}
      { result === "error409" &&  <p>  Vincode Already exist!</p>}
      { result === "empty" &&  <p>Input or File is Empty !  Please specify in the field to be changed</p>}
   </div>
  )
}

 export  const getResultnotify = (notify) => {
      if(notify === "ok"){
        toast.success(<ResultNotify result={notify}/>, {
          position: toast.POSITION.BOTTOM_RIGHT,
          draggable:true
        });
      }
      if(notify === "error" || notify === "error409"){
        toast.error(<ResultNotify result={notify}/>, {
          position: toast.POSITION.BOTTOM_RIGHT,
          draggable:true
        });
      }
      if(notify === "empty"){
        toast.warn(<ResultNotify result={notify}/>, {
          position: toast.POSITION.BOTTOM_RIGHT,
          draggable:true
        });
      }
       }



//delete user or product 

export const ResultDeleteNotify = ({result}) => {

  return (
    <div>
      { result === "ok" &&  <p> Deleted  Successfully!</p>}
      { result === "error" &&  <p> Not Deleted! Something Is Trouble</p>}
     
   </div>
  )
}


export  const _getResultDeletenotify = (notify) => {
  if(notify === "ok"){
    toast.success(<ResultDeleteNotify result={notify}/>, {
      position: toast.POSITION.BOTTOM_RIGHT,
      draggable:true
    });
  }
  if(notify === "error"){
    toast.error(<ResultDeleteNotify result={notify}/>, {
      position: toast.POSITION.BOTTOM_RIGHT,
      draggable:true
    });
  }
 
   }




   export const ResultLoginNotify = ({result}) => {

    return (
      <div>
        { result === "ok" &&  <p> Login Successfully!</p>}
        { result === "error" &&  <p>  Email/password is not Correct!</p>}
        { result === "empty" &&  <p>Input  is Empty !  Please specify in the field to be changed</p>}
        { result === "verifytoken" &&  <p>  Please Check Your Email , We Already Sent To You Email Verification Token!</p>}
     </div>
    )
  }


   export  const _getResultLoginNotify = (notify) => {
    if(notify === "ok"){
      toast.success(<ResultLoginNotify result={notify}/>, {
        position: toast.POSITION.BOTTOM_RIGHT,
        draggable:true
      });
    }
    if(notify === "error" ){
      toast.error(<ResultLoginNotify result={notify}/>, {
        position: toast.POSITION.BOTTOM_RIGHT,
        draggable:true
      });
    }
    if(notify === "empty"){
      toast.warn(<ResultLoginNotify result={notify}/>, {
        position: toast.POSITION.BOTTOM_RIGHT,
        draggable:true
      });
    }
    if(notify === "verifytoken"){
      toast.success(<ResultLoginNotify result={notify}/>, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
   
     }