import React from 'react'
import {render, RenderResult, fireEvent} from "@testing-library/react";
import Editor from "../components/Editor";

describe("EditorTestSuite", () => {
    
    let editor: RenderResult
    
    beforeEach(() => {
        editor = render(<Editor />)
    })
    
    test("it should contain textarea where users can put the text", () => {
        expect(editor.container.querySelectorAll("textarea").length).toBe(1)
    })
    
    test("on pressing enter, it should clear the text from the textarea", () => {
        editor.container.querySelector("textarea")!.value = "Foo Bar"
        fireEvent.keyDown(editor.getByRole("textbox"), {key: 'Enter', code: 13})
        expect(editor.container.querySelector("textarea")!.textLength).toBe(0)
    })
})