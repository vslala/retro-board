import React from 'react'
import {fireEvent, render, RenderResult} from '@testing-library/react';
import StickyNote from "../components/StickyNote";
import '../setupTests'
import RetroBoardService from "../service/RetroBoard/RetroBoardService";
import {Provider} from "react-redux";
import store from "../redux/store/Store";
import Note from "../models/Note";

describe('Component StickyNote Test', function () {
    let stickyNote: RenderResult
    let service = RetroBoardService.getInstance();
    let testNoteObj = new Note("testId-1", "wallId", "FooBar",
        {backgroundColor: '', likeBtnPosition: "right", textColor: "red"});
    service.updateNote = jest.fn().mockImplementation(() => {
        testNoteObj.noteText = "Foo Bar Tar"
        return testNoteObj
    })
    
    beforeEach(() => {
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
});