import * as React from 'react';
import {createContext, useState} from 'react';


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