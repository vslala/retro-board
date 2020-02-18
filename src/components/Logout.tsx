import React, {useEffect} from 'react'
import Firebase from "../service/Firebase";
import { Redirect } from 'react-router-dom';

interface Props {
    service: Firebase
}

const Logout: React.FunctionComponent<Props> = (props: Props) => {

    useEffect(() => {
        console.log("Logging out!")
        props.service.logout()
    }, [])

    return <Redirect to={"/login"} />

}

export default Logout