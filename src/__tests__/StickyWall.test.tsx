import React from 'react'
import '../setupTests'
import {render, RenderResult} from "@testing-library/react";
import StickyWall from "../components/StickyWall";
import {stickyWallModel} from "./testData";

describe("StickyWall test suite", () => {
    
    let renderedPage: RenderResult
    
    beforeEach(() => {
        renderedPage = render(<StickyWall title={"What went well"} stickyNotes={stickyWallModel.stickyNotes} />)
    })

    test("it should contain the wall title", () => {
        expect(renderedPage.getByText("What went well")).toBeInTheDocument()
    })

    test("it should create a wall with a list of sticky notes", () => {
        expect(renderedPage.container.querySelectorAll(".sticky-wall")[0].querySelectorAll(".card").length).toBe(2)
    })
    
    test("it should contain a `Add Note` button to add new notes to the wall", () => {
        expect(renderedPage.container.querySelectorAll("button").length).toBe(1)
    })
    
    
    
})