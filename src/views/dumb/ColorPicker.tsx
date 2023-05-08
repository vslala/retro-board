import * as React from 'react';
import {useState} from 'react';
import {Dropdown, DropdownButton} from "react-bootstrap";
import {SwatchesPicker} from "react-color";

interface ColorPickerProps {
    title: string
    handleOnChangeComplete: (color: any) => void
}

const ColorPicker: React.FunctionComponent<ColorPickerProps> = (props: ColorPickerProps) => {
    const [color, setColor] = useState<any>("#ffffff");
    const handleChange = (color:any) => {
        setColor(color);
        props.handleOnChangeComplete(color);
    }
    return <>
        <DropdownButton id="background_color_picker" title={props.title} variant={"light"} >
            <Dropdown.Item>
                <SwatchesPicker color={color} onChangeComplete={handleChange} />
            </Dropdown.Item>
        </DropdownButton>
    </>
}

export default ColorPicker;