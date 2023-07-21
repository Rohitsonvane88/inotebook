import React, { useState, useContext, useEffect, useRef } from 'react'
import noteContext from '../context/notes/noteContext'
import NoteItem from './NoteItem'
import { AddNote } from './AddNote'
import { useNavigate } from 'react-router-dom';

function Notes(props) {

  const context = useContext(noteContext)
  const { notes, getNotes, editNote } = context
  const navigate = useNavigate();
  useEffect(() => {
    if(localStorage.getItem('token')){
      getNotes()
    } else{
      navigate('/login')
    }
    // eslint-disable-next-line
  }, [])

  const ref = useRef(null)
  const refClose = useRef(null)

  const [note, setNote] = useState({id: "", etitle: "", edescription: "", etag: "default"})

  const handleClick = () => {
    editNote(note.id, note.etitle, note.edescription, note.etag)
    refClose.current.click()
    props.showAlert("Updated Successfully", "success")
  }

  const onChange = (e) => {
      setNote({...note, [e.target.name]: e.target.value})
  }

  const updateNote = (currentNote) => {
    ref.current.click()
    setNote({id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag})
  }

  return (
    <>
      <AddNote showAlert={props.showAlert}/>
      <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Text</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className='my-3'>
                <div className="mb-3">
                  <label htmlFor="etitle" className="form-label">Title</label>
                  <input type="text" className="form-control" id="etitle" name="etitle" aria-describedby="emailHelp" onChange={onChange} value={note.etitle} minLength={5} required/>
                </div>
                <div className="mb-3">
                  <label htmlFor="edescription" className="form-label">Description</label>
                  <input type="text" className="form-control" id="edescription" name='edescription' onChange={onChange} value={note.edescription} minLength={5} required/>
                </div>
                <div className="mb-3">
                  <label htmlFor="etag" className="form-label">Tag</label>
                  <input type="text" className="form-control" id="etag" name='etag' onChange={onChange} value={note.etag} minLength={5} required/>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button onClick={handleClick} type="button" className="btn btn-primary" disabled={note.etitle.length<5 || note.edescription.length<5}>Update Note</button>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-3">
        <h2>Your Notes</h2>
        <div className="container">
        {notes.length===0 && "No notes to display"}
        </div>
        {notes.map((notes) => {
          return <NoteItem key={notes._id} showAlert={props.showAlert} updateNote={updateNote} notes={notes} />
        })}
      </div>
    </>
  )
}

export default Notes