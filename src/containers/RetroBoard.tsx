import React from 'react'
import StickyWall from "../components/StickyWall";
import RetroBoardService from "../service/RetroBoardService";
import {RetroBoardModel} from "../interfaces/RetroBoardModel";

interface Props {}

interface RetroBoardState {
    model?: RetroBoardModel
}


class RetroBoard extends React.Component<Props, RetroBoardState> {
    state: RetroBoardState = {
        model: {data: []} // init data
    }

    constructor(props: any) {
        super(props)
    }

    componentDidMount(): void {
        this.setState({model: new RetroBoardService().getData()})
    }

    render() {
        let walls = this.state.model!.data.map((wall, index) => {
            return <div className="col-md-4">
                 <StickyWall title={wall.title} stickyNotes={wall.notes} />
            </div>
        })
        return (
            <div className="container">
                <div className="row">
                    {walls}
                </div>
            </div>
        )
    }

}

export default RetroBoard