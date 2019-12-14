import React from 'react';

interface HomePageModel {
    columnOneText: string
}

class HomePage extends React.Component<HomePageModel> {
    
    render() {
        const { columnOneText } = this.props;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <h3>{ columnOneText }</h3>
                    </div>
                </div>
            </div>
        )
    }
}

export default HomePage;