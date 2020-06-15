import * as React from 'react';
import {useState} from 'react';
import {Button, Form, FormGroup, FormLabel} from "react-bootstrap";

interface Props {
    title: string
    onSubmit: (textVal:string) => void
}
const EditText: React.FunctionComponent<Props> = (props:Props) => {

    const [showForm, setForm] = useState(false);
    const [textVal, setTextVal] = useState("");

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setTextVal(e.currentTarget.value);
    }

    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleOnBlur();
    }

    const handleOnBlur = () => {
        props.onSubmit(textVal);
        setForm(false);
    }

    if (showForm) {
        return <>
            <Form onSubmit={(e:React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
                <FormGroup>
                    <Form.Control value={textVal} onBlur={handleOnBlur}
                                  onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleChange(e)} />
                </FormGroup>
            </Form>
        </>
    }

    return <>
        <FormLabel>
            <span style={{fontSize: "x-large", fontWeight: "bold", marginRight: "5px"}}>{props.title}</span>
            <Button variant={"light"} onClick={() => setForm(true)}><i className={"fa fa-pencil-square-o"} /></Button>
        </FormLabel>
    </>

}

export default EditText;