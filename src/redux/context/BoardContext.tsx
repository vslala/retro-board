import * as React from 'react';
import {createContext, ReactNode, useState} from 'react';
import RetroBoard from "../../models/RetroBoard";


export interface BoardProps {
    uid?: string
    boardId?: ""
    maxLikes: number
    blur: string
}

export const BoardContext = createContext<any>(null);


export const BoardContextProvider:React.FC = (props) => {

    const [boardProps, setBoardProps] = useState<BoardProps>({
        maxLikes: 0,
        blur: "off"
    });

    return <BoardContext.Provider value={[boardProps, setBoardProps]}>
        {props.children}
    </BoardContext.Provider>

}