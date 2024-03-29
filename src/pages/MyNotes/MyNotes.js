import { Collapse, notification, Modal, Spin } from "antd";
import { connect } from "react-redux";
import { Form, Input, TextArea, Button } from "semantic-ui-react";
import React, { Component } from "react";

import * as actions from "../../store/actions";

import "./MyNotes.css";

const Panel = Collapse.Panel;

class MyNotes extends Component {
  state = {
    unauthenticatedUserNotes: [],
    mainNoteTitle: "",
    mainNoteBody: "",
    showDeleteNoteModal: false,
    noteToBeDeleted: null,
    itemsAreFetchedOnFirstRender: false
  };

  componentDidMount() {
    if (this.props.authenticated) {
      this.props.onFetchNotes(this.props.tokenId, this.props.userId, "notes");
    }
  }

  onChangeNoteTitle = (e, { value }) => {
    this.setState(() => ({ mainNoteTitle: value }));
  };

  onChangeNoteBody = (e, { value }) => {
    this.setState(() => ({ mainNoteBody: value }));
  };

  onSaveNote = () => {
    if (
      this.state.mainNoteTitle.trim() === "" ||
      this.state.mainNoteBody.trim() === ""
    ) {
      notification.open({
        message: "Can't Save Yet!",
        description:
          "Please fill in the title and the body of the note in order to save it."
      });
      return;
    }

    let currentDate = new Date();
    let currentDay = currentDate.toDateString();
    let currentTime =
      JSON.stringify(currentDate.getHours()) +
      ":" +
      JSON.stringify(currentDate.getMinutes());

    let noteToBeSaved = {
      title: this.state.mainNoteTitle,
      body: this.state.mainNoteBody,
      id: Math.floor(Math.random() * 1000000000 + 1),
      date: currentDay,
      time: currentTime
    };

    //for unauthenticated users
    if (!this.props.authenticated) {
      let savedNotes = [...this.state.unauthenticatedUserNotes];
      savedNotes.unshift(noteToBeSaved);
      this.setState(() => ({
        unauthenticatedUserNotes: savedNotes
      }));
    }

    //for authenticated users
    if (this.props.authenticated)
      this.props.onSaveNote(
        noteToBeSaved,
        this.props.tokenId,
        this.props.userId,
        "notes"
      );
  };

  onDeleteNote = order => {
    this.setState(() => ({
      showDeleteNoteModal: false
    }));
    if (order === "ok") {
      //For unauthenticated users
      if (!this.props.authenticated) {
        let savedNotes = [...this.state.unauthenticatedUserNotes];
        savedNotes.splice(this.state.noteToBeDeleted, 1);
        this.setState(() => ({
          unauthenticatedUserNotes: savedNotes
        }));
      }

      //For authenticated users
      if (this.props.authenticated)
        this.props.onDeleteNote(
          this.state.noteToBeDeleted,
          this.props.tokenId,
          this.props.userId,
          "notes"
        );
    } else {
      return;
    }
  };

  render() {
    //To update the items once when the page is refreshed
    if (this.props.authenticated && !this.state.itemsAreFetchedOnFirstRender) {
      this.props.onFetchNotes(this.props.tokenId, this.props.userId, "notes");
      this.setState(() => ({
        itemsAreFetchedOnFirstRender: true
      }));
    }

    let deleteNoteModal = (
      <Modal
        visible={this.state.showDeleteNoteModal}
        onOk={() => {
          this.onDeleteNote("ok");
        }}
        onCancel={() => {
          this.onDeleteNote("cancel");
        }}
      >
        <h2>Are you sure you want to delete this note?</h2>
      </Modal>
    );

    let savedNotes = "";
    if (this.props.loadingFetchingNotes) {
      savedNotes = <Spin style={{ marginTop: "20px" }} />;
    }

    let notesToBeFetched = this.state.unauthenticatedUserNotes;
    if (this.props.authenticated) notesToBeFetched = this.props.notes;

    if (notesToBeFetched) {
      savedNotes = (
        <Collapse
          bordered={false}
          style={{ width: "80%", margin: "30px auto" }}
        >
          {notesToBeFetched.map((note, index) => {
            return (
              <Panel header={note.title} key={index}>
                <p>
                  <small style={{ float: "left", textAlign: "left" }}>
                    {note.date}
                    <br />
                    <strong>{note.time}</strong>
                  </small>

                  <Button
                    floated="right"
                    size="mini"
                    color="red"
                    onClick={() =>
                      this.setState(() => ({
                        showDeleteNoteModal: true,
                        noteToBeDeleted: note
                      }))
                    }
                  >
                    Delete Note
                  </Button>
                  {deleteNoteModal}

                  <br />
                  <strong>{note.body}</strong>
                </p>
              </Panel>
            );
          })}
        </Collapse>
      );
    }

    return (
      <div className="MyNotes">
        {/**/}
        {/* Form for the current note: */}
        {/**/}

        <Form>
          <Form.Field>
            <label className="MyNotes__MainTitleHeader">Title</label>
            <Input
              placeholder="Title..."
              style={{ width: "70%" }}
              onChange={this.onChangeNoteTitle}
            />
          </Form.Field>

          <Form.Field>
            <label className="MyNotes__MainBodyHeader">Body</label>
            <TextArea
              placeholder="So, what would you like to talk about?"
              style={{
                width: "70%",
                height: "30vh",
                display: "block",
                margin: "0 auto"
              }}
              onChange={this.onChangeNoteBody}
            />
          </Form.Field>
          <Button
            type="submit"
            color="green"
            onClick={this.onSaveNote}
            loading={this.props.loadingSavingNotes}
          >
            Save Note
          </Button>

          {this.props.authenticated || (
            <p style={{ margin: "0", color: "#fff0dd", fontWeight: "bold" }}>
              (Sign up to be able to get back to your saved notes)
            </p>
          )}
        </Form>
        {/**/}
        {/* Viewing saved notes: */}
        {/**/}
        {savedNotes}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.authentication.authenticated,
    tokenId: state.authentication.tokenId,
    userId: state.authentication.userId,
    notes: state.saveAndFetch.notes,
    loadingSavingNotes: state.saveAndFetch.loadingSavingNotes,
    loadingFetchingNotes: state.saveAndFetch.loadingFetchingNotes
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSaveNote: (itemData, tokenId, userId, itemType) =>
      dispatch(actions.saveItem(itemData, tokenId, userId, itemType)),
    onFetchNotes: (tokenId, userId, itemType) =>
      dispatch(actions.fetchItems(tokenId, userId, itemType)),
    onDeleteNote: (itemData, tokenId, userId, itemType) =>
      dispatch(actions.deleteItem(itemData, tokenId, userId, itemType))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyNotes);
