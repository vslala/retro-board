import React from 'react'
import {Navigate, useLocation} from "react-router-dom";
import Firebase from "../../../service/Firebase";

interface Props {
    success: () => void
    children?: React.ReactNode
}

const LayoutUnauthenticated: React.FunctionComponent<Props> = (props:Props) => {

    const location = useLocation();
    const {pathname, search} = {...location};

    // if user is logged in and requests for login page
    // then redirect it to home (/)
    // otherwise, forward the request to original address
    if (Firebase.getInstance().getLoggedInUser()) {
        if (pathname.includes("login"))
            return <Navigate to={"/"} replace />
        return <Navigate to={`${pathname}${search}`} replace />
    }

    return <>
        {props.children}
    </>
}

export default LayoutUnauthenticated;
