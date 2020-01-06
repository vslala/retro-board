import React from 'react'
import '../setupTests'
import {fireEvent, render, RenderResult} from "@testing-library/react";
import StickyWall from "../components/StickyWall";
import RetroBoardService from "../service/RetroBoard/RetroBoardService";
import {StickyWallModel} from "../interfaces/StickyWallModel";
import Note from "../models/Note";
import User from "../models/User";
import Firebase from "../service/Firebase";

describe("StickyWall test suite", () => {
    let modifyStickyNoteMock = jest.fn((modifiedNote: Note) => console.log("modified..."))
    // mocking the deleteNote method
    let service = RetroBoardService.getInstance()
    service.deleteNote = jest.fn().mockImplementation(() => Promise.resolve())

    let note1 = new Note("retroBoard", "wallId", "Foo",
        {textColor: "black", likeBtnPosition: "right", backgroundColor: "white"},
        service)
    note1.createdBy.push("varun@gmail.com")
    
    let note2 = new Note("retroBoard", "wallId", "Bar",
        {textColor: "black", likeBtnPosition: "right", backgroundColor: "white"},
        service)
    note2.createdBy.push("varun@gmail.com")
    
    let stickyWallModel: StickyWallModel = {
        title: "What went well",
        stickyNotes: [
            note1,note2
        ],
        wallId: "WallId",
        style: {stickyNote: {textColor: "black", likeBtnPosition: "right", backgroundColor: "white"}}
    }

    function buildStickyWall(): RenderResult {
        return render(<StickyWall style={
            {stickyNote: {textColor: "black", likeBtnPosition: "right", backgroundColor: "white"}}
        }
                                  wallId={"1"}
                                  retroBoardService={service}
                                  title={"What went well"}
                                  stickyNotes={stickyWallModel.stickyNotes}/>)
    }

    beforeEach(() => {
        let user = new User()
        user.idToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjUxMjRjY2JhZDVkNWZiZjNiYTJhOGI1ZWE3MTE4NDVmOGNiMjZhMzYiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiVmFydW4gc2hyaXZhc3RhdmEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FBdUU3bUFETUFZYTRaTk15U0lMdE9FQVlXa1lkbmhRSnFGcDd0TFlWZW9aIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3JldHJvLWJvYXJkLWViY2U2IiwiYXVkIjoicmV0cm8tYm9hcmQtZWJjZTYiLCJhdXRoX3RpbWUiOjE1NzgyMjk0MTEsInVzZXJfaWQiOiJ4c3U4TkxYTTNjYjM5RGhYaEtrNzBFcnNsS0EyIiwic3ViIjoieHN1OE5MWE0zY2IzOURoWGhLazcwRXJzbEtBMiIsImlhdCI6MTU3ODIyOTQxMSwiZXhwIjoxNTc4MjMzMDExLCJlbWFpbCI6InZhcnVuc2hyaXZhc3RhdmEwMDdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTI3MTI5NjQyNjcwMDI4NTEyMTMiXSwiZW1haWwiOlsidmFydW5zaHJpdmFzdGF2YTAwN0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.SM8YRR2kbXFDsP0EFcu5476duQHF27S7cRepXd2pJve1UpjXvgcnOay6Q71gnDuRwTkFAIcwRaX4zsYzdKt5M9mlLYMgUl7sl0MJLIt2N0VW9VY7EHM3JHVkNTPx-j2gP-iqu7yWlBPVuCcV97gboCZ9aXd2XRNMJL6kofvsOs597Ydpns6yWujVy09-YVfHjQJOFiRh6UCUHKg_dbQ5L6rFjCMzbEoLiWH8TFda2MKJoPqC3E7bOy_uao2ef5pX5aLQbOKtfoSSWwVyzgo7sqwxgQimDdBQIkD7H_N_OwumrXQeGJ-YTSbadTaFZ6ZLrA2KVVwATGndkq_HeY7JhA"
        user.displayName = "Varun Shrivastava"
        user.email = "varun@gmail.com"
        user.username = "vslala"
        localStorage.setItem(User.USER_INFO, JSON.stringify(user))
        let firebase = Firebase.getInstance()
        firebase.getLoggedInUser = jest.fn().mockImplementation(() => user)
    })

    test("it should contain the wall title", () => {
        let renderedPage = buildStickyWall()
        expect(renderedPage.getByText("What went well")).toBeInTheDocument()
    })

    test("it should create a wall with a list of sticky notes", () => {
        let renderedPage = buildStickyWall()
        expect(renderedPage.container.querySelectorAll(".sticky-wall")[0].querySelectorAll(".card").length).toBe(2)
    })

    test("it should contain a `Add Note` button to add new notes to the wall", () => {
        let renderedPage = buildStickyWall()
        expect(renderedPage.container.querySelectorAll("button").length).toBe(1)
    })

    test("it should delete the note from the wall", async () => {
        let renderedPage = buildStickyWall()
        let deleteBadge = renderedPage.getByTestId("delete_badge_1")
        await fireEvent.click(deleteBadge)
        expect(renderedPage.container.querySelectorAll(".sticky-wall")[0].querySelectorAll(".card").length).toBe(1)
    })

    test("it should add new note to the wall", async () => {
        let renderedPage = buildStickyWall()
        let user = new User()
        user.idToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjUxMjRjY2JhZDVkNWZiZjNiYTJhOGI1ZWE3MTE4NDVmOGNiMjZhMzYiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiVmFydW4gc2hyaXZhc3RhdmEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FBdUU3bUFETUFZYTRaTk15U0lMdE9FQVlXa1lkbmhRSnFGcDd0TFlWZW9aIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3JldHJvLWJvYXJkLWViY2U2IiwiYXVkIjoicmV0cm8tYm9hcmQtZWJjZTYiLCJhdXRoX3RpbWUiOjE1NzgyMjk0MTEsInVzZXJfaWQiOiJ4c3U4TkxYTTNjYjM5RGhYaEtrNzBFcnNsS0EyIiwic3ViIjoieHN1OE5MWE0zY2IzOURoWGhLazcwRXJzbEtBMiIsImlhdCI6MTU3ODIyOTQxMSwiZXhwIjoxNTc4MjMzMDExLCJlbWFpbCI6InZhcnVuc2hyaXZhc3RhdmEwMDdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTI3MTI5NjQyNjcwMDI4NTEyMTMiXSwiZW1haWwiOlsidmFydW5zaHJpdmFzdGF2YTAwN0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.SM8YRR2kbXFDsP0EFcu5476duQHF27S7cRepXd2pJve1UpjXvgcnOay6Q71gnDuRwTkFAIcwRaX4zsYzdKt5M9mlLYMgUl7sl0MJLIt2N0VW9VY7EHM3JHVkNTPx-j2gP-iqu7yWlBPVuCcV97gboCZ9aXd2XRNMJL6kofvsOs597Ydpns6yWujVy09-YVfHjQJOFiRh6UCUHKg_dbQ5L6rFjCMzbEoLiWH8TFda2MKJoPqC3E7bOy_uao2ef5pX5aLQbOKtfoSSWwVyzgo7sqwxgQimDdBQIkD7H_N_OwumrXQeGJ-YTSbadTaFZ6ZLrA2KVVwATGndkq_HeY7JhA"
        user.displayName = "Varun Shrivastava"
        user.email = "25274@gmail.com"
        user.username = "vslala"
        localStorage.setItem(User.USER_INFO, JSON.stringify(user))

        let addNewBtn = renderedPage.getByTestId("add_new_note_btn")
        await fireEvent.click(addNewBtn)
        let textarea = renderedPage.container.querySelector("textarea")! as HTMLElement
        textarea.textContent = "Some text"
        await fireEvent.change(textarea, {target: {value: "foo bar"}})
        await fireEvent.keyUp(textarea, {key: "Enter"})

        expect(renderedPage.container.querySelectorAll(".sticky-wall")[0].querySelectorAll(".card").length).toBe(3)
    })

    test("it should not delete the note if the user is not the creator of it", async () => {
        let renderedPage = buildStickyWall()
        let deleteBadge = renderedPage.getByTestId("delete_badge_1")
        await fireEvent.click(deleteBadge)
        expect(renderedPage.container.querySelectorAll(".sticky-wall")[0].querySelectorAll(".card").length).toBe(2)
    })

})