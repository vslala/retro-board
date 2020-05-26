import React from 'react'
import '../setupTests'
import RetroBoardPage from "../containers/RetroBoardPage";
import {fireEvent, render, RenderResult} from '@testing-library/react';
import {Provider} from "react-redux";
import store from "../redux/store/Store";
import {MemoryRouter} from "react-router-dom";
import {mocks} from "../setupTests";
import RetroBoardActions from "../redux/actions/RetroBoardActions";
import RetroBoardServiceFactory from "../service/RetroBoard/RetroBoardServiceFactory";

function getRetroBoardService() {
    const retroBoardService = RetroBoardServiceFactory.getInstance()
    retroBoardService.getDataOnUpdate = jest.fn().mockImplementation((boardId:string, wallId:string, callBack: () => void) => {

    })
    return retroBoardService;
}

function renderPage(): RenderResult {
    const retroBoardService = getRetroBoardService();
    const routeProps = mocks.routeProps("/retro-board/:uid/:boardId", "/retro-board/ccvYjCNXEnMt12wz4dOXM7CpbVp1/-Lz2GmX4YfBJRvYseleR")
    return render(
        <Provider store={store}>
            <MemoryRouter>
                <RetroBoardPage {...routeProps} retroBoardService={retroBoardService}  />
            </MemoryRouter>
        </Provider>
    )
}

test("it should render zero walls", async () => {
    let dom = renderPage()
    let stickyWalls = dom.container.querySelectorAll("section.sticky-wall")
    expect(stickyWalls.length).toBe(0)
})

test("it should render 3 sticky walls", async () => {
    store.dispatch(new RetroBoardActions().createRetroWalls({
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
                "retroBoardService": getRetroBoardService()
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
                "retroBoardService": getRetroBoardService()
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
                "retroBoardService": getRetroBoardService()
            }
        ]
    }))
    let dom = renderPage()
    let stickyWalls = dom.container.querySelectorAll("section.sticky-wall")
    expect(stickyWalls.length).toBe(3)
})

test("two notes should be added to the wall with id ToImprove", async () => {
    let dom = renderPage()
    await store.dispatch(new RetroBoardActions().createRetroBoard({
        userId: "123",
        "blur": "off",
        "id": "-Lz2GmX4YfBJRvYseleR",
        "maxLikes": 5,
        "name": "Test 101"
    }))
    await store.dispatch(new RetroBoardActions().createRetroWalls({
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
                "retroBoardService": getRetroBoardService()
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
                "retroBoardService": getRetroBoardService()
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
                "retroBoardService": getRetroBoardService()
            }
        ]
    }))
    await store.dispatch(new RetroBoardActions().createNote({
        "createdBy": [
            "jhansireddy007@gmail.com"
        ],
        "likedBy": [
            {
                "username": "kH38B",
                "displayName": "abc1",
                "email": "abc1@retro.com",
                "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImNiOGUwZDk3Mjg2MWIwNGJlN2RjNzVhMWIzYmUzYjIyOWIyNWYyMDUiLCJ0eXAiOiJKV1QifQ.eyJwcm92aWRlcl9pZCI6ImFub255bW91cyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9yZXRyby1ib2FyZC1lYmNlNiIsImF1ZCI6InJldHJvLWJvYXJkLWViY2U2IiwiYXV0aF90aW1lIjoxNTgyMDE1OTY4LCJ1c2VyX2lkIjoicWJXMzgyNmxPaVc1aGxPTnBnUHVZZHNTaE8zMyIsInN1YiI6InFiVzM4MjZsT2lXNWhsT05wZ1B1WWRzU2hPMzMiLCJpYXQiOjE1ODIwMTU5NjgsImV4cCI6MTU4MjAxOTU2OCwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6e30sInNpZ25faW5fcHJvdmlkZXIiOiJhbm9ueW1vdXMifX0.FAeH5yRDDAdcurEwjyDoZVffmsS78CtBAEAzlfv5C0ZF9Sk9BP-CJxgYKfQKDMj6_ChlFaHrnEtgCEk0ZB9h0oDP7C2-BiOlsXYP5v2g5b9t78yOewjPVr5_Psv19IiYbfxjXLGbyxiQtjby7riN6iFc1zLt3ydIcqqaIL-RnxMK8vBct36qpK_c7MPmt-Pg9UqxZKMLUsWqtgrsI-Ru5r2yeidushKpkaouj7YYCgOz8wZccECMSYjsgDEn658UDDX116M8CRy0oti9z0t4M1CCX8_E4qXKWDWTiOBt4YvRS0pkeFC3s76_CqaVbmkbOMau7PI6Tr7IYr0sPa7KMA",
                "uid": "qbW3826lOiW5hlONpgPuYdsShO33"
            },
            {
                "username" : "kH38B",
                "displayName": "kH38B",
                "email": "HrGAB@retro.com",
                "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImNiOGUwZDk3Mjg2MWIwNGJlN2RjNzVhMWIzYmUzYjIyOWIyNWYyMDUiLCJ0eXAiOiJKV1QifQ.eyJwcm92aWRlcl9pZCI6ImFub255bW91cyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9yZXRyby1ib2FyZC1lYmNlNiIsImF1ZCI6InJldHJvLWJvYXJkLWViY2U2IiwiYXV0aF90aW1lIjoxNTgyMDAyMDUxLCJ1c2VyX2lkIjoiY2N2WWpDTlhFbk10MTJ3ejRkT1hNN0NwYlZwMSIsInN1YiI6ImNjdllqQ05YRW5NdDEyd3o0ZE9YTTdDcGJWcDEiLCJpYXQiOjE1ODIwMjAzNjMsImV4cCI6MTU4MjAyMzk2MywiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6e30sInNpZ25faW5fcHJvdmlkZXIiOiJhbm9ueW1vdXMifX0.KmwDr0QidEZLGC-khvJLWks8FiL1hhUQ0vWsgnLZAb9t-fiORBwJWwEIBlT6np4oBHIVCQcROrxs4qHrxyg9bPkbmas9q29HPmDavLjSAepidY_wpmHOkF9wa70tPnISOAwHuJJfQb0JzY00SHvNM0cx-3oeVisy8q_b3h3y_tPzNjHZDpW-p38lqXaOKp8O4ZnW3Rql3nuVUB17zN6DCKjza-GC7B-uJT2z-jGqzQG3B2qfy10bKqT23aITA9a8HOfuvTIlNhfEJD73xboUFts__VTviDTvDfJZqFL3P15qQCkZC63b5ezEJfzI6b86fPMPjCSrJF_r9JfWu-DPpg",
                "uid": "ccvYjCNXEnMt12wz4dOXM7CpbVp1"
            }
        ],
        "noteId": "-M0Lf8s3_X0w1rESP6cy",
        "noteText": "Hello",
        "retroBoardId": "-Lz2GmX4YfBJRvYseleR",
        "style": {
            "backgroundColor": "#e91e63",
            "likeBtnPosition": "right",
            "textColor": "white"
        },
        "wallId": "ToImprove"
    }))
    await store.dispatch(new RetroBoardActions().createNote({
        "createdBy": [
            "vslala@gmail.com"
        ],
        "likedBy": [
            {
                "username": "kH38B",
                "displayName": "abc1",
                "email": "abc1@retro.com",
                "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImNiOGUwZDk3Mjg2MWIwNGJlN2RjNzVhMWIzYmUzYjIyOWIyNWYyMDUiLCJ0eXAiOiJKV1QifQ.eyJwcm92aWRlcl9pZCI6ImFub255bW91cyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9yZXRyby1ib2FyZC1lYmNlNiIsImF1ZCI6InJldHJvLWJvYXJkLWViY2U2IiwiYXV0aF90aW1lIjoxNTgyMDE1OTY4LCJ1c2VyX2lkIjoicWJXMzgyNmxPaVc1aGxPTnBnUHVZZHNTaE8zMyIsInN1YiI6InFiVzM4MjZsT2lXNWhsT05wZ1B1WWRzU2hPMzMiLCJpYXQiOjE1ODIwMTU5NjgsImV4cCI6MTU4MjAxOTU2OCwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6e30sInNpZ25faW5fcHJvdmlkZXIiOiJhbm9ueW1vdXMifX0.FAeH5yRDDAdcurEwjyDoZVffmsS78CtBAEAzlfv5C0ZF9Sk9BP-CJxgYKfQKDMj6_ChlFaHrnEtgCEk0ZB9h0oDP7C2-BiOlsXYP5v2g5b9t78yOewjPVr5_Psv19IiYbfxjXLGbyxiQtjby7riN6iFc1zLt3ydIcqqaIL-RnxMK8vBct36qpK_c7MPmt-Pg9UqxZKMLUsWqtgrsI-Ru5r2yeidushKpkaouj7YYCgOz8wZccECMSYjsgDEn658UDDX116M8CRy0oti9z0t4M1CCX8_E4qXKWDWTiOBt4YvRS0pkeFC3s76_CqaVbmkbOMau7PI6Tr7IYr0sPa7KMA",
                "uid": "qbW3826lOiW5hlONpgPuYdsShO33"
            },
            {
                "username" : "kH38B",
                "displayName": "kH38B",
                "email": "HrGAB@retro.com",
                "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImNiOGUwZDk3Mjg2MWIwNGJlN2RjNzVhMWIzYmUzYjIyOWIyNWYyMDUiLCJ0eXAiOiJKV1QifQ.eyJwcm92aWRlcl9pZCI6ImFub255bW91cyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9yZXRyby1ib2FyZC1lYmNlNiIsImF1ZCI6InJldHJvLWJvYXJkLWViY2U2IiwiYXV0aF90aW1lIjoxNTgyMDAyMDUxLCJ1c2VyX2lkIjoiY2N2WWpDTlhFbk10MTJ3ejRkT1hNN0NwYlZwMSIsInN1YiI6ImNjdllqQ05YRW5NdDEyd3o0ZE9YTTdDcGJWcDEiLCJpYXQiOjE1ODIwMjAzNjMsImV4cCI6MTU4MjAyMzk2MywiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6e30sInNpZ25faW5fcHJvdmlkZXIiOiJhbm9ueW1vdXMifX0.KmwDr0QidEZLGC-khvJLWks8FiL1hhUQ0vWsgnLZAb9t-fiORBwJWwEIBlT6np4oBHIVCQcROrxs4qHrxyg9bPkbmas9q29HPmDavLjSAepidY_wpmHOkF9wa70tPnISOAwHuJJfQb0JzY00SHvNM0cx-3oeVisy8q_b3h3y_tPzNjHZDpW-p38lqXaOKp8O4ZnW3Rql3nuVUB17zN6DCKjza-GC7B-uJT2z-jGqzQG3B2qfy10bKqT23aITA9a8HOfuvTIlNhfEJD73xboUFts__VTviDTvDfJZqFL3P15qQCkZC63b5ezEJfzI6b86fPMPjCSrJF_r9JfWu-DPpg",
                "uid": "ccvYjCNXEnMt12wz4dOXM7CpbVp1"
            }
        ],
        "noteId": "-M0Lf8s3_X0w1rESP6c2",
        "noteText": "Hello",
        "retroBoardId": "-Lz2GmX4YfBJRvYseleR",
        "style": {
            "backgroundColor": "#e91e63",
            "likeBtnPosition": "right",
            "textColor": "white"
        },
        "wallId": "ToImprove"
    }))

    let notes = dom.container.querySelectorAll(".card.sticky-note")
    expect(notes.length).toBe(2)
})

test("it should be able to sort the notes by votes when sort by votes is selected", async () => {
    let dom = renderPage()
    await store.dispatch(new RetroBoardActions().createRetroBoard({
        userId: "123",
        "blur": "off",
        "id": "-Lz2GmX4YfBJRvYseleR",
        "maxLikes": 5,
        "name": "Test 101"
    }))
    await store.dispatch(new RetroBoardActions().createRetroWalls({
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
                "retroBoardService": getRetroBoardService()
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
                "retroBoardService": getRetroBoardService()
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
                "retroBoardService": getRetroBoardService()
            }
        ]
    }))
    await store.dispatch(new RetroBoardActions().createNote({
        "createdBy": [
            "jhansireddy007@gmail.com"
        ],
        "likedBy": [
            {
                "username": "kH38B",
                "displayName": "abc1",
                "email": "abc1@retro.com",
                "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImNiOGUwZDk3Mjg2MWIwNGJlN2RjNzVhMWIzYmUzYjIyOWIyNWYyMDUiLCJ0eXAiOiJKV1QifQ.eyJwcm92aWRlcl9pZCI6ImFub255bW91cyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9yZXRyby1ib2FyZC1lYmNlNiIsImF1ZCI6InJldHJvLWJvYXJkLWViY2U2IiwiYXV0aF90aW1lIjoxNTgyMDE1OTY4LCJ1c2VyX2lkIjoicWJXMzgyNmxPaVc1aGxPTnBnUHVZZHNTaE8zMyIsInN1YiI6InFiVzM4MjZsT2lXNWhsT05wZ1B1WWRzU2hPMzMiLCJpYXQiOjE1ODIwMTU5NjgsImV4cCI6MTU4MjAxOTU2OCwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6e30sInNpZ25faW5fcHJvdmlkZXIiOiJhbm9ueW1vdXMifX0.FAeH5yRDDAdcurEwjyDoZVffmsS78CtBAEAzlfv5C0ZF9Sk9BP-CJxgYKfQKDMj6_ChlFaHrnEtgCEk0ZB9h0oDP7C2-BiOlsXYP5v2g5b9t78yOewjPVr5_Psv19IiYbfxjXLGbyxiQtjby7riN6iFc1zLt3ydIcqqaIL-RnxMK8vBct36qpK_c7MPmt-Pg9UqxZKMLUsWqtgrsI-Ru5r2yeidushKpkaouj7YYCgOz8wZccECMSYjsgDEn658UDDX116M8CRy0oti9z0t4M1CCX8_E4qXKWDWTiOBt4YvRS0pkeFC3s76_CqaVbmkbOMau7PI6Tr7IYr0sPa7KMA",
                "uid": "qbW3826lOiW5hlONpgPuYdsShO33"
            },
            {
                "username" : "kH38B",
                "displayName": "kH38B",
                "email": "HrGAB@retro.com",
                "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImNiOGUwZDk3Mjg2MWIwNGJlN2RjNzVhMWIzYmUzYjIyOWIyNWYyMDUiLCJ0eXAiOiJKV1QifQ.eyJwcm92aWRlcl9pZCI6ImFub255bW91cyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9yZXRyby1ib2FyZC1lYmNlNiIsImF1ZCI6InJldHJvLWJvYXJkLWViY2U2IiwiYXV0aF90aW1lIjoxNTgyMDAyMDUxLCJ1c2VyX2lkIjoiY2N2WWpDTlhFbk10MTJ3ejRkT1hNN0NwYlZwMSIsInN1YiI6ImNjdllqQ05YRW5NdDEyd3o0ZE9YTTdDcGJWcDEiLCJpYXQiOjE1ODIwMjAzNjMsImV4cCI6MTU4MjAyMzk2MywiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6e30sInNpZ25faW5fcHJvdmlkZXIiOiJhbm9ueW1vdXMifX0.KmwDr0QidEZLGC-khvJLWks8FiL1hhUQ0vWsgnLZAb9t-fiORBwJWwEIBlT6np4oBHIVCQcROrxs4qHrxyg9bPkbmas9q29HPmDavLjSAepidY_wpmHOkF9wa70tPnISOAwHuJJfQb0JzY00SHvNM0cx-3oeVisy8q_b3h3y_tPzNjHZDpW-p38lqXaOKp8O4ZnW3Rql3nuVUB17zN6DCKjza-GC7B-uJT2z-jGqzQG3B2qfy10bKqT23aITA9a8HOfuvTIlNhfEJD73xboUFts__VTviDTvDfJZqFL3P15qQCkZC63b5ezEJfzI6b86fPMPjCSrJF_r9JfWu-DPpg",
                "uid": "ccvYjCNXEnMt12wz4dOXM7CpbVp1"
            }
        ],
        "noteId": "-M0Lf8s3_X0w1rESP6cy",
        "noteText": "Hello",
        "retroBoardId": "-Lz2GmX4YfBJRvYseleR",
        "style": {
            "backgroundColor": "#e91e63",
            "likeBtnPosition": "right",
            "textColor": "white"
        },
        "wallId": "ToImprove"
    }))
    await store.dispatch(new RetroBoardActions().createNote({
        "createdBy": [
            "vslala@gmail.com"
        ],
        "likedBy": [
            {
                "username" : "kH38B",
                "displayName": "kH38B",
                "email": "HrGAB@retro.com",
                "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImNiOGUwZDk3Mjg2MWIwNGJlN2RjNzVhMWIzYmUzYjIyOWIyNWYyMDUiLCJ0eXAiOiJKV1QifQ.eyJwcm92aWRlcl9pZCI6ImFub255bW91cyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9yZXRyby1ib2FyZC1lYmNlNiIsImF1ZCI6InJldHJvLWJvYXJkLWViY2U2IiwiYXV0aF90aW1lIjoxNTgyMDAyMDUxLCJ1c2VyX2lkIjoiY2N2WWpDTlhFbk10MTJ3ejRkT1hNN0NwYlZwMSIsInN1YiI6ImNjdllqQ05YRW5NdDEyd3o0ZE9YTTdDcGJWcDEiLCJpYXQiOjE1ODIwMjAzNjMsImV4cCI6MTU4MjAyMzk2MywiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6e30sInNpZ25faW5fcHJvdmlkZXIiOiJhbm9ueW1vdXMifX0.KmwDr0QidEZLGC-khvJLWks8FiL1hhUQ0vWsgnLZAb9t-fiORBwJWwEIBlT6np4oBHIVCQcROrxs4qHrxyg9bPkbmas9q29HPmDavLjSAepidY_wpmHOkF9wa70tPnISOAwHuJJfQb0JzY00SHvNM0cx-3oeVisy8q_b3h3y_tPzNjHZDpW-p38lqXaOKp8O4ZnW3Rql3nuVUB17zN6DCKjza-GC7B-uJT2z-jGqzQG3B2qfy10bKqT23aITA9a8HOfuvTIlNhfEJD73xboUFts__VTviDTvDfJZqFL3P15qQCkZC63b5ezEJfzI6b86fPMPjCSrJF_r9JfWu-DPpg",
                "uid": "ccvYjCNXEnMt12wz4dOXM7CpbVp1"
            }
        ],
        "noteId": "-M0Lf8s3_X0w1rESP6c2",
        "noteText": "Hello",
        "retroBoardId": "-Lz2GmX4YfBJRvYseleR",
        "style": {
            "backgroundColor": "#e91e63",
            "likeBtnPosition": "right",
            "textColor": "white"
        },
        "wallId": "ToImprove"
    }))

    let sortSelector = dom.getByTestId("sort_select")
    await fireEvent.focus(sortSelector)
    await fireEvent.mouseDown(sortSelector)

    let sortByVotesOption = await dom.findByText("Sort by Up-votes")
    await fireEvent.click(sortByVotesOption)

    let notes = dom.container.querySelectorAll(".card.sticky-note")
    expect(notes.length).toBe(2)
})