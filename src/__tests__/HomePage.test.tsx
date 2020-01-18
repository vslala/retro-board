import React from 'react';
import {render, RenderResult} from '@testing-library/react';
import HomePage from "../containers/HomePage";
import '../setupTests'
import {MemoryRouter} from 'react-router-dom';
import {createLocation, createMemoryHistory} from 'history'
import {match} from 'react-router'
import {Provider} from "react-redux";
import store from "../redux/store/Store";
import RetroBoardService from "../service/RetroBoard/RetroBoardService";
import RetroBoard from "../models/RetroBoard";

const path = `/route/:id`;
const mockedMatch: match<{ id: string }> = {
    isExact: false,
    path,
    url: path.replace(':id', '1'),
    params: { id: "1" }
};

describe("HomePage tests", () => {
    
    let homePage: RenderResult
    let routeProps = {
        history: createMemoryHistory(),
        location: createLocation(mockedMatch.url),
        match: mockedMatch
    }

    beforeEach(() => {
        let retroBoardMockService = RetroBoardService.getInstance()
        retroBoardMockService.getMyBoards = async () => {
            return [new RetroBoard("testId", "Name")]
        }
        homePage = render(<Provider store={store}><MemoryRouter><HomePage {...routeProps} retroBoardService={retroBoardMockService}/></MemoryRouter></Provider>)
    })

    test("it should contain a link to initialize a new RetroDashboard", () => {
        expect(homePage.getByText("Create Retro Board")).toBeInTheDocument()
    })
});

//
// test("it should render home page successfully", () => {
//     let homePage = render(<HomePage columnOneText={homePageModel.columnOneText}
//                                     columnOneWall={homePageModel.columnOneWall}/>)
//     expect(homePage.container.firstChild).toHaveClass("container")
// })
//
// test("it should render a column for `What went well`", () => {
//     let homePage = render(<HomePage columnOneText={homePageModel.columnOneText}
//                                     columnOneWall={homePageModel.columnOneWall}/>)
//     expect(homePage.getByText("What went well")).toBeInTheDocument();
// })
//
// test("it should load the sticky wall with sticky notes", () => {
//     let homePage = render(<HomePage columnOneText={homePageModel.columnOneText}
//                                     columnOneWall={homePageModel.columnOneWall}/>)
//     expect(homePage.getByText("Foo")).toBeInTheDocument()
// })