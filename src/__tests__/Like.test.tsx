import React from 'react'
import {fireEvent, render, RenderResult} from '@testing-library/react'
import Like from "../components/Like";
import '../setupTests'
import User from "../models/User";

const testUser: User = new User()
testUser.username = "vslala"

describe("LikeComponent test suite", () => {
    
    let likeComponent: RenderResult
    
    beforeEach(() => {
        localStorage.setItem("user", JSON.stringify(testUser))
        likeComponent = render(<Like stickyNoteId={"sticky_note_1"} />)
    })
    
    test("it should container a clickable like", () => {
        expect(likeComponent.getByText("Like")).toBeInTheDocument()
    })
    
    test("it should contain total number of likes made on that component", () => {
        expect(likeComponent.getByText("0")).toBeInTheDocument()
    })
    
    test("it should keep track of the sticky note and the users that liked the button", () => {
        let btn = likeComponent.getByTestId("like_btn")
        fireEvent.click(btn)
        let totalVotes = likeComponent.getByTestId("total_votes")
        expect(Number(totalVotes.textContent)).toBe(1)
    })
    
    test("it should not increment the upvote if the user has already voted", () => {
        let btn = likeComponent.getByTestId("like_btn")
        fireEvent.click(btn)
        fireEvent.click(btn)
        fireEvent.click(btn)
        let totalVotes = likeComponent.getByTestId("total_votes")
        expect(Number(totalVotes.textContent)).toBe(1)
    })
})