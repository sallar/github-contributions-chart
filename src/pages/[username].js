import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import App from './index'

export default function PrefilledUsername() {

  const route = useRouter().asPath
  const [usernameProps, setUsernameProps] = useState("");
  
  useEffect(() => {
    if (route.split("/")[1] !== '[username]') { 
      console.log(route.split("/")[1])
      setUsernameProps(route.split("/")[1]);
    }
  }, [route])

  return (
    <App username={usernameProps} key={usernameProps} />
  )
}