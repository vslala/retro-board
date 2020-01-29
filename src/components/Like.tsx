import React from 'react'
import User from "../models/User";
import {Badge, Card} from "react-bootstrap";

interface LikeProps {
    stickyNoteId: string
    likedBy: User[]
    handleUpVote: (user:User) => void
}

interface LikeState {
    users: User[]
}

class Like extends React.Component<LikeProps, LikeState> {

    state: LikeState = {
        users: this.props.likedBy
    }

    constructor(props: LikeProps) {
        super(props)
        this.handleUpVote = this.handleUpVote.bind(this)
    }

    handleUpVote(e:any) {
        e.preventDefault()
        // get the username from localstorage
        let user: User = this.getCurrentUser() as User
        
        // add the user into the state array
        if (user) {
            this.props.handleUpVote(user)
        }
    }

    private getCurrentUser(): User | undefined {
        let userJson = localStorage.getItem(User.USER_INFO)
        if (userJson)
            return JSON.parse(userJson)
        else
            console.log("Error: User is not logged in!", ) // TODO: show error message
    }

    render() {
        
        return <div data-testid={"like_btn"} onClick={this.handleUpVote}>
            <Badge variant="dark" style={{cursor: "pointer", margin: "0"}}><span data-testid={"total_votes"}>{this.props.likedBy.length}</span></Badge>
            <Card.Link style={{color: "white"}} href={"#"}><i style={{color: "darkgrey"}} className={"fa fa-thumbs-up"}></i></Card.Link>
        </div>
    }
}

export default Like