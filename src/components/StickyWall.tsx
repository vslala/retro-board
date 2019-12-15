import React, {Component} from 'react'
import StickyNote from "./StickyNote";
import {StickyWallModel} from "../interfaces/StickyWallModel";

class StickyWall extends Component<StickyWallModel> {

    render() {
        const {stickyNotes, title} = this.props
        let stickers = stickyNotes.map((note: string, index: number) => (
            <StickyNote key={index} noteText={note}/>
        ))

        return (
            <section className="sticky-wall">
                <h3>{title}</h3>
                {stickers}
            </section>
        )
    }
}

export default StickyWall