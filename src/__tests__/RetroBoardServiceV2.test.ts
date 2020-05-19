import RetroBoardServiceV2 from "../service/RetroBoard/RetroBoardServiceV2";
import Note from "../models/Note";
import {globalAny} from "../setupTests";
import CreateResponse from "../models/CreateResponse";
import RetroBoard from "../models/RetroBoard";
import Firebase from "../service/Firebase";
import User from "../models/User";

describe("RetroBoardServiceV2 Test Suite", () => {

    test("create new note", async () => {
        let note = new Note("1", "wall_id", "text", {backgroundColor: "black", likeBtnPosition: "right", textColor: "black"});
        globalAny.fetch = jest.fn().mockImplementation((url) => {
            if (url === "getNote") {
                return Promise.resolve({
                    status: 200,
                    json: () => Promise.resolve(Note.toJSON(note))
                });
            }
            note.noteId = "123";
            return Promise.resolve({
                status: 201,
                json: () => Promise.resolve(JSON.stringify({resourceUrl: "getNote"}))
            });
        });

        let newNote = await RetroBoardServiceV2.getInstance().addNewNote(note);

        expect(newNote.noteId).toBe("123");
    });

    test("create new retro board", async () => {
        // mock firebase function for loggedInUser
        let firebase = Firebase.getInstance();
        firebase.getLoggedInUser = () => {
            let user = new User();
            user.uid = "johndoe";
            return user;
        }

        // mock fetch call
        let retroBoard = new RetroBoard("id", "retro-board", "vslala");
        globalAny.fetch = jest.fn().mockImplementation((url) => {
            if (url === "someurl") {
                return Promise.resolve({
                    status: 200,
                    json: () => Promise.resolve(RetroBoard.toJSON(retroBoard))
                });
            }
            retroBoard.id = "123";
            return Promise.resolve({
                status: 201,
                json: () => Promise.resolve(JSON.stringify({resourceUrl: "someurl"}))
            });
        });

        // call the actual function
        let newNote = await RetroBoardServiceV2.getInstance().createNewRetroBoard({title: "retro-board", maxLikes: 5});

        expect(retroBoard.id).toBe("123");
    });
})