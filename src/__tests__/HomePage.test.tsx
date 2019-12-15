import React from 'react';
import {render} from '@testing-library/react';
import HomePage from "./HomePage";
import '../setupTests'

describe("HomePage tests", () => {
    test("it should render home page successfully", () => {
        let homePage = render(<HomePage columnOneText={"What went well"}/>)
        expect(homePage.container.firstChild).toHaveClass("container")
    })
    
    test("it should render a column for `What went well`", () => {
        let homePage = render(<HomePage columnOneText={"What went well"} />)
        expect(homePage.getByText("What went well")).toBeInTheDocument();
    })
});