import * as React from 'react'
import {useState} from 'react'
import {Button, Carousel, Modal} from "react-bootstrap";

interface Props {
    items: Array<string>
    style: {textColor: string, backgroundColor: string}
}

const CarouselView: React.FunctionComponent<Props> = (props: Props) => {

    const [carouselView, setCarouselView] = useState(false);
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex: number) => setIndex(selectedIndex);

    const showCarouselView = () => setCarouselView(true);

    const hideCarouselView = () => setCarouselView(false);

    return <>
        <div style={{margin: "5px"}}>
            <Button title={"Retrospect"} variant={"link"} onClick={showCarouselView}>
                <i className={"fa fa-lg fa-eye"} />
            </Button>
        </div>

        <>
            <Modal show={carouselView} onHide={hideCarouselView} style={{backgroundColor: "black"}}>
                <Modal.Body style={{backgroundColor: props.style.backgroundColor}}>
                    <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>
                        {props.items.map((text, index) => (
                            <Carousel.Item key={index}>
                                <div style={{height: "400px"}}>
                                    <Carousel.Caption style={{color: props.style.textColor}}>
                                        <div style={{height: "200px", overflowY: "scroll"}}>
                                            <h3 style={{overflowY: "scroll"}}>{text}</h3>
                                        </div>
                                    </Carousel.Caption>
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Modal.Body>
            </Modal>
        </>
    </>
}

export default CarouselView;