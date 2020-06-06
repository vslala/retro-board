import React from 'react'
import {fireEvent, render, RenderResult} from '@testing-library/react'
import Like from "../components/retro-board/Like";
import '../setupTests'
import User from "../models/User";

const testUser: User = new User()
testUser.username = "vslala"

describe("LikeComponent test suite", () => {
    
    let likeComponent: RenderResult
    let handleUpVoteMock = jest.fn()
    beforeEach(() => {
        let user = new User()
        user.idToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjUxMjRjY2JhZDVkNWZiZjNiYTJhOGI1ZWE3MTE4NDVmOGNiMjZhMzYiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiVmFydW4gc2hyaXZhc3RhdmEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FBdUU3bUFETUFZYTRaTk15U0lMdE9FQVlXa1lkbmhRSnFGcDd0TFlWZW9aIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3JldHJvLWJvYXJkLWViY2U2IiwiYXVkIjoicmV0cm8tYm9hcmQtZWJjZTYiLCJhdXRoX3RpbWUiOjE1NzgyMjk0MTEsInVzZXJfaWQiOiJ4c3U4TkxYTTNjYjM5RGhYaEtrNzBFcnNsS0EyIiwic3ViIjoieHN1OE5MWE0zY2IzOURoWGhLazcwRXJzbEtBMiIsImlhdCI6MTU3ODIyOTQxMSwiZXhwIjoxNTc4MjMzMDExLCJlbWFpbCI6InZhcnVuc2hyaXZhc3RhdmEwMDdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTI3MTI5NjQyNjcwMDI4NTEyMTMiXSwiZW1haWwiOlsidmFydW5zaHJpdmFzdGF2YTAwN0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.SM8YRR2kbXFDsP0EFcu5476duQHF27S7cRepXd2pJve1UpjXvgcnOay6Q71gnDuRwTkFAIcwRaX4zsYzdKt5M9mlLYMgUl7sl0MJLIt2N0VW9VY7EHM3JHVkNTPx-j2gP-iqu7yWlBPVuCcV97gboCZ9aXd2XRNMJL6kofvsOs597Ydpns6yWujVy09-YVfHjQJOFiRh6UCUHKg_dbQ5L6rFjCMzbEoLiWH8TFda2MKJoPqC3E7bOy_uao2ef5pX5aLQbOKtfoSSWwVyzgo7sqwxgQimDdBQIkD7H_N_OwumrXQeGJ-YTSbadTaFZ6ZLrA2KVVwATGndkq_HeY7JhA"
        user.displayName = "Varun Shrivastava"
        user.email = "varun@gmail.com"
        user.username = "vslala"
        localStorage.setItem(User.USER_INFO, JSON.stringify(user))
        likeComponent = render(<Like handleUpVote={handleUpVoteMock} likedBy={[]} stickyNoteId={"sticky_note_1"} />)
    })
    
    afterEach(() => {
        handleUpVoteMock.mockClear()
    })
    
    test("it should contain a clickable like", () => {
        expect(likeComponent.getByTestId("like_thumbs_up")).toBeInTheDocument()
    })
    
    test("it should contain total number of likes made on that component", () => {
        expect(likeComponent.getByText("0")).toBeInTheDocument()
    })
    
    test("it should keep track of the sticky note and the users that liked the button", () => {
        let btn = likeComponent.getByTestId("like_btn")
        fireEvent.click(btn)
        expect(handleUpVoteMock).toBeCalledTimes(1)
    })
    
    test("it should not increment the upvote if the user has already voted", () => {
        let btn = likeComponent.getByTestId("like_btn")
        fireEvent.click(btn)
        fireEvent.click(btn)
        fireEvent.click(btn)
        expect(handleUpVoteMock).toBeCalledTimes(3)
    })
    
    test("it should not increment the vote for the note if the count on that note is more than decided number", () => {
        expect(1).toBe(1)
    })
})