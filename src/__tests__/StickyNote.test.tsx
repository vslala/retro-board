import React from 'react'
import {fireEvent, render, RenderResult} from '@testing-library/react';
import StickyNote from "../components/StickyNote";
import '../setupTests'

describe('Component StickyNote Test', function () {
    let stickyNote: RenderResult
    let mockHandleEnterFn = jest.fn((str: string) => console.log("New Note: ", str))
    
    beforeEach(() => {
        stickyNote = render(<StickyNote noteId={"testid"} 
            style={{backgroundColor: '', likeBtnPosition: "right", textColor: "red"}} 
            noteText={"FooBar"} />)
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
    
    test("it should modify the note text and hide the editor", () => {
        let note = stickyNote.getByTestId("editor")
        fireEvent.click(note)
        
        let editor = stickyNote.container.querySelector("textarea")!
        fireEvent.change(editor, {target: { value: "Foo Bar Tar"}})
        fireEvent.keyUp(editor, {key: "Enter"})
        
        expect(stickyNote.getByText("Foo Bar Tar")).toBeInTheDocument()
    })
});