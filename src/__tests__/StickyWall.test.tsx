import React from 'react'
import '../setupTests'
import {render, RenderResult} from "@testing-library/react";
import StickyWall from "../components/StickyWall";
import RetroBoardService from "../service/RetroBoard/RetroBoardService";
import {StickyWallModel} from "../interfaces/StickyWallModel";
import Note from "../models/Note";

describe("StickyWall test suite", () => {
    let modifyStickyNoteMock = jest.fn((modifiedNote: Note) => console.log("modified..."))
    let stickyWallModel: StickyWallModel = {
        title: "What went well",
        stickyNotes: [
            new Note("retroBoard", "wallId", "Foo",
                {textColor: "black", likeBtnPosition: "right", backgroundColor: "white"},
                RetroBoardService.getInstance()),
            new Note("retroBoard", "wallId", "Bar",
                {textColor: "black", likeBtnPosition: "right", backgroundColor: "white"},
                RetroBoardService.getInstance())

        ],
        wallId: "WallId",
        style: {stickyNote: {textColor: "black", likeBtnPosition: "right", backgroundColor: "white"}}
    }
    
    let renderedPage: RenderResult

    beforeEach(() => {
        renderedPage = render(<StickyWall style={
            {stickyNote: {textColor: "black", likeBtnPosition: "right", backgroundColor: "white"}}
        }
                                          wallId={"1"}
                                          retroBoardService={RetroBoardService.getInstance()}
                                          title={"What went well"}
                                          stickyNotes={stickyWallModel.stickyNotes}/>)
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