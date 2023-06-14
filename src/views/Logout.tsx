import React, {useEffect} from 'react'
import Firebase from "../service/Firebase";
import {Navigate} from 'react-router-dom';

interface Props {
    service: Firebase
}

const Logout: React.FunctionComponent<Props> = (props: Props) => {

    useEffect(() => {
        props.service.logout()
    }, [props])

    return <Navigate to={"/login"} replace={true} />

}

export default Logout
