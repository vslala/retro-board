import React from 'react';
import StickyWall from "../components/StickyWall";
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import {HomePageModel} from "../interfaces/HomePageModel";

class HomePage extends React.Component<HomePageModel> {
    
    render() {  
        const { linkText, linkUrl } = this.props
        return <div className={"container"}>
            <div className="row">
                <div className="col-md-4">
                    <Link to={linkUrl? linkUrl : "/retro-board"} >{linkText? linkText : 'Create New Retro Board'}</Link>
                </div>
            </div>
        
        </div>
    }
}

export default HomePage;