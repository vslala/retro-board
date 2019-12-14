import React from 'react'

interface StickyNoteModel {
    noteText: string
}

class StickyNote extends React.Component<StickyNoteModel> {
    render () {
        const { noteText } = this.props
        return (
            <div className="card">
                <div className="card-body">
                    <p className="card-text">{ noteText }</p>
                </div>
            </div>
        )
    }
}

export default StickyNote