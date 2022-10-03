import {getData } from "../components/controllers/savingData"
export default function ({ store, route, redirect }) {
  if( !getData("account")){
    return redirect('/signin')
  } else {
    let getDataReturn = getData("account")
    if(getDataReturn && getDataReturn.accountType=="admin"){
      if(false){
        return redirect('/signin')
      }else {

      }
    }
  }
}
