import React from 'react'
import {render} from '@testing-library/react';
import StickyNote from "./StickyNote";

describe('Component StickyNote Test', function () {
    test("it should display note text in a card style", () => {
        let stickyNote = render(<StickyNote noteText={"FooBar"} />)
        expect(stickyNote.getByText("FooBar")).toBeInTheDocument();
    })
});