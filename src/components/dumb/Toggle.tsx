import React from 'react'
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

interface Props {
    onSort: () => void
}

interface State {
    sort: boolean
}
class Toggle extends React.Component<Props, State> {
    
    state: State = {
        sort: false
    }
    
    constructor(props: Props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }
    
    handleChange(val: any): void {
        
        this.setState({sort: val})
        if (val)
            this.props.onSort()
    }
    

    render() {
        return <ButtonToolbar>
            <ToggleButtonGroup type="radio" onChange={this.handleChange} name="options" defaultValue={this.state.sort}>
                <ToggleButton value={true}>Sort</ToggleButton>
                <ToggleButton value={false}>Un-Sort</ToggleButton>
            </ToggleButtonGroup>
        </ButtonToolbar>
    }
}

export default Toggle