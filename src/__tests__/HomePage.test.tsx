import React from 'react';
import {render, RenderResult} from '@testing-library/react';
import HomePage from "../containers/HomePage";
import '../setupTests'
import StickyWall from "../components/StickyWall";
import {homePageModel} from "./testData";
import { MemoryRouter } from 'react-router-dom';

describe("HomePage tests", () => {
    
    let homePage: RenderResult
    
    beforeEach(() => {
        homePage = render(<MemoryRouter><HomePage /></MemoryRouter>)
    })

    test("it should contain a link to initialize a new RetroDashboard", () => {
        expect(homePage.getByText("Create New Retro Board")).toBeInTheDocument()
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