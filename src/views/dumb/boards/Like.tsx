import React, {useState} from 'react'
import User from "../../../models/User";
import {Badge, Card} from "react-bootstrap";

interface Props {
    stickyNoteId: string
}

interface State {
    users: User[]
}

const Like: React.FunctionComponent<Props> = (props) => {
    const [state, setState] = useState<State>({users: []});

    const handleUpVote = (e: any) => {
        e.preventDefault()
        // get the username from localstorage
        let user: User = getCurrentUser() as User

        // add the user into the state array
        if (user) {
            const newUsers = [...state.users, user];
            console.log("New Users: ",newUsers);
            setState({users: newUsers});
        }
    }

    const getCurrentUser = (): User | undefined => {
        let userJson = localStorage.getItem(User.USER_INFO)
        if (userJson)
            return JSON.parse(userJson)
        else
            console.log("Error: User is not logged in!",) // TODO: show error message
    }

    return <div data-testid={"like_btn"} onClick={handleUpVote}>
        <Badge  bg="light" style={{cursor: "pointer", margin: "0"}}><span
            data-testid={"total_votes"}>{state.users.length}</span></Badge>
        <Card.Link style={{color: "white"}} href={"#"}><i data-testid={"like_thumbs_up"} style={{color: "darkgrey"}}
                                                          className={"fa fa-thumbs-up"}></i></Card.Link>
    </div>
}

export default Like
