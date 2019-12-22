// @ts-nocheck
import React from "react"
import {StickyWallModel} from "../interfaces/StickyWallModel";
import {HomePageModel} from "../interfaces/HomePageModel";
import StickyNote from "../components/StickyNote";

export const stickyWallModel: StickyWallModel = {
    title: "What went well",
    stickyNotes: [
        <StickyNote noteText={"Foo"} />, 
        <StickyNote noteText={"Bar"} />
    ]
}

export const homePageModel: HomePageModel = {
    linkText: "Create New Retro Board",
    linkUrl: "/retro-board"
}