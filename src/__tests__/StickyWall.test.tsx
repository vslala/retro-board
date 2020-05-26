import React from 'react'
import '../setupTests'
import {fireEvent, render, RenderResult} from "@testing-library/react";
import StickyWall from "../components/StickyWall";
import RetroBoardServiceV1 from "../service/RetroBoard/RetroBoardServiceV1";
import Note from "../models/Note";
import User from "../models/User";
import Firebase from "../service/Firebase";
import {Provider} from "react-redux";
import store from "../redux/store/Store";
import RetroWall from "../models/RetroWall";
import Notes from "../models/Notes";
import {RetroBoardService} from "../service/RetroBoard/RetroBoardService";
import RetroBoardServiceFactory from "../service/RetroBoard/RetroBoardServiceFactory";

describe("StickyWall test suite", () => {

    let service: RetroBoardService

    function note1() {
        let note1 = new Note("retroBoard", "Whatwentwell", "Foo",
            {textColor: "black", likeBtnPosition: "right", backgroundColor: "white"})
        note1.noteId = "note_1"
        note1.createdBy = ("varun@gmail.com")
        return note1;
    }

    function note2() {
        let note2 = new Note("retroBoard", "Whatwentwell", "Bar",
            {textColor: "black", likeBtnPosition: "right", backgroundColor: "white"})
        note2.noteId = "note_2"
        note2.createdBy = ("varun@gmail.com")
        return note2;
    }

    function mockRetroBoardServiceMethods(): RetroBoardService {
        service = RetroBoardServiceFactory.getInstance()
        service.deleteNote = jest.fn().mockImplementation((note: Note) => {
            
            return note
        })
        service.getNotes = jest.fn().mockImplementation(async (retroBoardId, wallId) => {
            return new Notes([note1(), note2()])
        })
        service.getDataOnUpdate = jest.fn((retroBoardId, retroWallId, callback) =>
            Promise.resolve(callback(new Notes([note1(), note2()]))))
        service.addNewNote = jest.fn().mockImplementation((note: Note) => {
            return note
        })

        return service
    }

    function buildStickyWall(): RenderResult {
        let noteOne = note1()
        let noteTwo = note2()

        return render(<Provider store={store}>
            <StickyWall
                notes={[noteOne, noteTwo]}
                retroWall={new RetroWall("retroBoard", "What went well",
                    {stickyNote: {backgroundColor: '', likeBtnPosition: "right", textColor: "red"}}, service)}/>
        </Provider>)
    }

    function buildTestUser() {
        let user = new User()
        user.idToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjUxMjRjY2JhZDVkNWZiZjNiYTJhOGI1ZWE3MTE4NDVmOGNiMjZhMzYiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiVmFydW4gc2hyaXZhc3RhdmEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FBdUU3bUFETUFZYTRaTk15U0lMdE9FQVlXa1lkbmhRSnFGcDd0TFlWZW9aIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3JldHJvLWJvYXJkLWViY2U2IiwiYXVkIjoicmV0cm8tYm9hcmQtZWJjZTYiLCJhdXRoX3RpbWUiOjE1NzgyMjk0MTEsInVzZXJfaWQiOiJ4c3U4TkxYTTNjYjM5RGhYaEtrNzBFcnNsS0EyIiwic3ViIjoieHN1OE5MWE0zY2IzOURoWGhLazcwRXJzbEtBMiIsImlhdCI6MTU3ODIyOTQxMSwiZXhwIjoxNTc4MjMzMDExLCJlbWFpbCI6InZhcnVuc2hyaXZhc3RhdmEwMDdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTI3MTI5NjQyNjcwMDI4NTEyMTMiXSwiZW1haWwiOlsidmFydW5zaHJpdmFzdGF2YTAwN0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.SM8YRR2kbXFDsP0EFcu5476duQHF27S7cRepXd2pJve1UpjXvgcnOay6Q71gnDuRwTkFAIcwRaX4zsYzdKt5M9mlLYMgUl7sl0MJLIt2N0VW9VY7EHM3JHVkNTPx-j2gP-iqu7yWlBPVuCcV97gboCZ9aXd2XRNMJL6kofvsOs597Ydpns6yWujVy09-YVfHjQJOFiRh6UCUHKg_dbQ5L6rFjCMzbEoLiWH8TFda2MKJoPqC3E7bOy_uao2ef5pX5aLQbOKtfoSSWwVyzgo7sqwxgQimDdBQIkD7H_N_OwumrXQeGJ-YTSbadTaFZ6ZLrA2KVVwATGndkq_HeY7JhA"
        user.displayName = "Varun Shrivastava"
        user.email = "varun@gmail.com"
        user.username = "vslala"
        return user;
    }

    beforeEach(() => {
        mockRetroBoardServiceMethods()
        localStorage.setItem(User.USER_INFO, JSON.stringify(buildTestUser()))
        let firebase = Firebase.getInstance()
        firebase.getLoggedInUser = jest.fn().mockImplementation(() => buildTestUser())
    })

    afterEach(() => {
        // jest.resetAllMocks()
    })

    test("it should contain the wall title", () => {
        let renderedPage = buildStickyWall();
        expect(renderedPage.getByText("What went well")).toBeInTheDocument()
    })

    test("it should create a wall with a list of sticky notes", () => {
        let renderedPage = buildStickyWall()
        expect(service.getDataOnUpdate).toHaveBeenCalledTimes(1)
        // expect(renderedPage.container.querySelectorAll(".sticky-wall")[0].querySelectorAll(".card").length).toBe(2)
    })

    test("it should contain a `Add Note` button to add new notes to the wall", () => {
        let renderedPage = buildStickyWall()
        expect(renderedPage.container.querySelectorAll("button").length).toBe(1)
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

        expect(textarea).toBeInTheDocument()

        textarea.textContent = "Some text"
        await fireEvent.change(textarea, {target: {value: "foo bar"}})
        await fireEvent.keyUp(textarea, {key: "Enter"})

        expect(service.addNewNote).toHaveBeenCalledTimes(1)
    })

})