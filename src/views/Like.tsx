import React, {useMemo, useState} from 'react'
import User from "../models/User";
import {Badge, Card} from "react-bootstrap";
import {RetroBoardService} from "../service/RetroBoard/RetroBoardService";
import RetroBoardServiceFactory from "../service/RetroBoard/RetroBoardServiceFactory";
import {eventBus, EventRegistry} from "../common";
import Note from "../models/Note";

interface Props {
    note: Note
}

interface State {
    users: User[]
}

class LikeViewModel {
    private retroBoardService: RetroBoardService

    constructor() {
        this.retroBoardService = RetroBoardServiceFactory.getInstance();
    }

    handleUpvote(note: Note, user: User) {
        eventBus.publish(EventRegistry.UPVOTE, {user: user, noteId: note.noteId});
    }
}

const Like: React.FunctionComponent<Props> = (props) => {
    const vm = useMemo(() => new LikeViewModel(), []);
    const [state, setState] = useState<State>({users: props.note.likedBy});

    const handleUpVote = (e: any) => {
        e.preventDefault()
        // get the username from localstorage
        let user: User = getCurrentUser() as User

        // add the user into the state array
        if (user) {
            const newUsers = [...state.users, user];
            console.log("New Users: ",newUsers);
            vm.handleUpvote(props.note, user);
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
