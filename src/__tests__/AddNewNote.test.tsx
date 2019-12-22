import React from 'react'
import '../setupTests'
import {render, RenderResult, fireEvent} from "@testing-library/react";
import AddNewNote from "../components/AddNewNote";

describe('AddNewNote test suite', () => {

    let addNewNote: RenderResult
    let addNewNoteBtn: HTMLInputElement
    
    beforeEach(() => {
        let addNewNoteFn = jest.fn((note:string) => console.log("New Note: ", note))
        addNewNote = render(<AddNewNote addNote={addNewNoteFn} />)
        addNewNoteBtn = addNewNote.container.querySelector<HTMLInputElement>("button")!
    })

    test("it should show add new note button", () => {
        expect(addNewNoteBtn).toBeInTheDocument()
    })
    
    test("it should show editor in place of add new note button", () => {
        fireEvent.click(addNewNoteBtn)
        expect(addNewNote.container.querySelector("textarea")).toBeInTheDocument()
    })


})