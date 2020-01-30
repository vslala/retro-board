import React from 'react'
import {fireEvent, render, RenderResult} from '@testing-library/react';
import StickyNote from "../components/StickyNote";
import '../setupTests'
import RetroBoardService from "../service/RetroBoard/RetroBoardService";
import {Provider} from "react-redux";
import store from "../redux/store/Store";
import Note from "../models/Note";
import RetroBoardActions from "../redux/actions/RetroBoardActions";
import User from "../models/User";

describe('Component StickyNote Test', function () {
    let stickyNote: RenderResult
    let service = RetroBoardService.getInstance();
    let testNoteObj = new Note("testId-1", "wallId", "FooBar",
        {backgroundColor: '', likeBtnPosition: "right", textColor: "red"});
    service.updateNote = jest.fn().mockImplementation(() => {
        testNoteObj.noteText = "Foo Bar Tar"
        return testNoteObj
    })
    
    service.deleteNote = jest.fn().mockImplementation(async (note: Note) => {
        return note
    })
    
    beforeEach(() => {
        let testUser = new User()
        testUser.uid = "test-id"
        testUser.email = "test@example.com"
        testUser.idToken = "id-token"
        testUser.username = "username"
        testUser.displayName = "displayName"
        
        for (let i=0; i < 5; i++) {
            let testNote = new Note("RetroBoardId", "WallId", "text" + i, {backgroundColor: "", likeBtnPosition: "right", textColor: ""})
            testNote.likedBy.push(testUser)
            store.dispatch(new RetroBoardActions().createNote(testNote))
        }
        
        localStorage.setItem(User.USER_INFO, JSON.stringify(testUser))
        store.dispatch(new RetroBoardActions().createRetroBoard({
            maxLikes: 5,
            name: "RetroBoard",
            id: "RetroBoardId"
        }));
        
        
        stickyNote = render(<Provider store={store}><StickyNote
            retroBoardService={service} 
            note={testNoteObj}
        /></Provider>)
    })

    test("it should display note text in a card style", () => {
        expect(stickyNote.getByText("FooBar")).toBeInTheDocument();
    })
    
    test("it should show textarea when clicked", () => {
        fireEvent.click(stickyNote.getByTestId("editor"))
        // fireEvent.click(stickyNote.container.querySelector(".card")!)
        expect(stickyNote.container.querySelector("textarea")).toBeInTheDocument()
    })
    
    test("it should show the editor with the current note text", () => {
        let note = stickyNote.getByTestId("editor")
        fireEvent.click(note)
        
        let editor = stickyNote.container.querySelector("textarea")!
        expect(editor.value).toBe("FooBar")
    })
    
    test("it should modify the note text and hide the editor", async () => {
        let note = stickyNote.getByTestId("editor")
        await fireEvent.click(note)
        
        let editor = stickyNote.container.querySelector("textarea")!
        
        await fireEvent.change(editor, {target: { value: "Foo Bar Tar"}})
        await fireEvent.keyUp(editor, {key: "Enter"})
        
        expect(service.updateNote).toHaveBeenCalledTimes(1)
    })
    
    test("it should delete the note", async () => {
        let deleteBtn = stickyNote.getByTestId("delete_badge_" + testNoteObj.noteId)
        await fireEvent.click(deleteBtn)
        
        expect(service.deleteNote).toBeCalledTimes(1)
    })
    
    test("user should not be able to like the note more than the maxlikes limit set to the board", async () => {
        let likeBtn = stickyNote.getByTestId("like_thumbs_up")
        await fireEvent.click(likeBtn)
        
        let totalCount = stickyNote.getByTestId("total_votes")
        expect(totalCount.textContent).toBe("0")
    })
    
    test("it should show a toast message if user like count exceeds", async () => {
        let likeBtn = stickyNote.getByTestId("like_thumbs_up")
        await fireEvent.click(likeBtn)
        
        let totalCount = stickyNote.getByTestId("total_votes")
        expect(totalCount.textContent).toBe("0")
        expect(stickyNote.getByTestId("toast")).toBeInTheDocument()
    })
});