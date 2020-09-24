import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from "react-bootstrap/Button";
import {Link, withRouter} from "react-router-dom";
import {RouteComponentProps} from "react-router";
import Firebase from "../../service/Firebase";

interface Props extends RouteComponentProps {

}
const PageHeader: React.FunctionComponent<Props> = (props:Props) => {
    const logout = () => {
        localStorage.clear();
        props.history.push("/login");
    }

    let loggedInUser = Firebase.getInstance().getLoggedInUser()!;

    return <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/#/">Retro Board</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Link className={"nav-link"} to={"/"}>Home</Link>
                {
                    loggedInUser.isEmailVerified ?
                        <Link className={"nav-link"} to={"/teams"}>Teams</Link>: <></>
                }

                {/*<Nav.Link href="#link">Link</Nav.Link>*/}
                {/*<NavDropdown title="Dropdown" id="basic-nav-dropdown">*/}
                {/*    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>*/}
                {/*    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>*/}
                {/*    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>*/}
                {/*    <NavDropdown.Divider/>*/}
                {/*    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>*/}
                {/*</NavDropdown>*/}
            </Nav>
            <Button onClick={logout} variant={"outline-primary"}>
                <i className={"fa fa-sign-out"} />
            </Button>
        </Navbar.Collapse>
    </Navbar>
}

export default withRouter(PageHeader)