import React from 'react'
import {fireEvent, render, RenderResult} from "@testing-library/react";
import Editor from "../components/Editor";
import "../setupTests"

describe("EditorTestSuite", () => {
    
    let editor: RenderResult
    let enterKey = jest.fn((str: string) => console.log("Enter key pressed! String passed: ", str))
    
    beforeEach(() => {
        editor = render(<Editor handleEnter={enterKey} />)
    })
    
    test("it should contain textarea where users can put the text", () => {
        expect(editor.container.querySelectorAll("textarea").length).toBe(1)
    })
    
    test("on pressing enter, it should clear the text from the textarea",  async () => {
        let textArea = editor.getByTestId("editor_textarea")
        fireEvent.change(textArea, {target: {value: "foo bar"}})
        fireEvent.keyUp(textArea, {key: "Enter"})
        
        expect(textArea).toHaveValue("")
    })
})