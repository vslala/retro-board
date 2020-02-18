// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import {RenderResult} from "@testing-library/react";
import {createLocation, createMemoryHistory} from "history";
import {match} from "react-router";
import RetroBoardService from "./service/RetroBoard/RetroBoardService";

let localStorageMock = (function() {
  let store = new Map()
  return {
    
    getItem(key: string):string {
      return store.get(key);
    },
    
    setItem: function(key: string, value: string) {
      store.set(key, value);
    },
    
    clear: function() {
      store = new Map();
    },
    
    removeItem: function(key: string) {
        store.delete(key)
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

export const mocks = {

  routeProps: (mapping: string, url: string) => {
    const path = mapping;
    const mockedMatch: match<{ uid:string, id: string }> = {
      isExact: true,
      path,
      url: url,
      params: { uid: "uid", id: "1" }
    };

    return {
      history: createMemoryHistory(),
      location: createLocation(mockedMatch.url),
      match: mockedMatch
    }
  }
}

export const dummyRetroWalls = (retroBoardService: RetroBoardService) => ({
  "walls": [
    {
      "retroBoardId": "-Lz2GmX4YfBJRvYseleR",
      "wallId": "WentWell",
      "title": "Went Well",
      "style": {
        "stickyNote": {
          "backgroundColor": "#009688",
          "textColor": "white",
          "likeBtnPosition": "right"
        }
      },
      "sortCards": false,
      "retroBoardService": retroBoardService
    },
    {
      "retroBoardId": "-Lz2GmX4YfBJRvYseleR",
      "wallId": "ToImprove",
      "title": "To Improve",
      "style": {
        "stickyNote": {
          "backgroundColor": "#e91e63",
          "textColor": "white",
          "likeBtnPosition": "right"
        }
      },
      "sortCards": false,
      "retroBoardService": retroBoardService
    },
    {
      "retroBoardId": "-Lz2GmX4YfBJRvYseleR",
      "wallId": "ActionItems",
      "title": "Action Items",
      "style": {
        "stickyNote": {
          "backgroundColor": "#9c27b0",
          "textColor": "white",
          "likeBtnPosition": "right"
        }
      },
      "sortCards": false,
      "retroBoardService": retroBoardService
    }
  ]
})