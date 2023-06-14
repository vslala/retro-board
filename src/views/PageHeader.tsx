import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from "react-bootstrap/Button";
import {Link, useNavigate} from "react-router-dom";
import Firebase from "../service/Firebase";

interface Props {
    children?: React.ReactNode
}
const PageHeader: React.FunctionComponent<Props> = (props:Props) => {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.clear();
        navigate("/login");
    }

    let loggedInUser = Firebase.getInstance().getLoggedInUser()!;

    return <Navbar bg="light" expand="lg">
        <Link to={"/"} className={"navbar-brand"}>Retro Board</Link>
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

export default PageHeader;
