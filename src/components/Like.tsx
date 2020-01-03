import React from 'react'
import User from "../models/User";
import {Badge, Card} from "react-bootstrap";

interface LikeProps {
    stickyNoteId: string
}

interface LikeState {
    users: User[]
}

class Like extends React.Component<LikeProps, LikeState> {

    state: LikeState = {
        users: []
    }

    constructor(props: LikeProps) {
        super(props)
        this.handleUpvote = this.handleUpvote.bind(this)
    }

    handleUpvote(e:any) {
        e.preventDefault()
        // get the username from localstorage
        let user: User = this.getCurrentUser() as User
        
        // add the user into the state array
        if (user) {
            let users = this.state.users
            let hasVotedBefore = users.filter((u) => u.username === user.username).length > 0
            if (!hasVotedBefore) {
                users.push(user as User)
                let newUsersState = users
                this.setState({users: newUsersState})
            }
        }
        
        // TODO: make a service call to update the like state in the database
    }

    private getCurrentUser(): User | undefined {
        let userJson = localStorage.getItem("user")
        if (userJson)
            return JSON.parse(userJson)
        else
            console.log("Error") // TODO: show error message
    }

    render() {
        return <div data-testid={"like_btn"} onClick={this.handleUpvote}>
            <Badge variant="dark" style={{cursor: "pointer"}}><span data-testid={"total_votes"}>{this.state.users.length}</span></Badge>
            <Card.Link style={{color: "white"}} href={"#"}><span>Like</span></Card.Link>
        </div>
    }
}

export default Like