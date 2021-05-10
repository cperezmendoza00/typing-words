import logo from './logo.svg';


import React, { useState, useEffect } from 'react';
import './App.css';
import { API, Storage, Auth} from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';


const initialFormState = { name: '', description: '' }

function App() {

  function nametoindex(name,type){
    let index = null;
    if(type == 'belong'){
      if(name == "a1") index = 0;
      if(name == "a2") index = 1;
      if(name == "b1") index = 2;
      if(name == "b2") index = 3;
      if(name == "c1") index = 4;
    }
    if(type == 'desc'){
      if(name == "adverb") index = 1;
      if(name == "auxiliary verb") index = 2;
      if(name == "conjunction") index = 3;
      if(name == "definite article") index = 4;
      if(name == "determiner") index = 5;
      if(name == "exclamation") index = 6;
      if(name == "indefinite article") index = 7;
      if(name == "infinitive marker") index = 8;
      if(name == "linking verb") index = 9;
      if(name == "modal verb") index = 10;
      if(name == "noun") index = 11;
      if(name == "number") index = 12;
      if(name == "ordinal number") index = 13;
      if(name == "preposition") index = 14;
      if(name == "pronoun") index = 15;
      if(name == "verb") index = 16;
    }
    return index
  }

  function indextoname(index,type){
    let name = null;
    if(type == 'belong'){
      if(index == 0) name = "a1";
      if(index == 1) name = "a2";
      if(index == 2) name = "b1";
      if(index == 3) name = "b2";
      if(index == 4) name = "c1";
    }
    if(type == 'desc'){
      if(index == 0) name ="adverb";
      if(index == 1) name = "auxiliary verb";
      if(index == 2) name = "conjunction";
      if(index == 3) name = "definite article";
      if(index == 4) name = "determiner";
      if(index == 5) name = "exclamation";
      if(index == 6) name = "indefinite article";
      if(index == 7) name = "infinitive marker";
      if(index == 8) name = "linking verb";
      if(index == 9) name = "modal verb";
      if(index == 10) name = "noun";
      if(index == 11) name = "number";
      if(index == 12) name = "ordinal number";
      if(index == 13) name = "preposition";
      if(index == 14) name = "pronoun";
      if(index == 15) name = "verb";
    }
    return name
  }
  async function onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
    fetchNotes();
  }

  
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ 
      query: listNotes,
    });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(notesFromAPI.map(async note => {
      if (note.image) {
        const image = await Storage.get(note.image);
        note.image = image;
      }
      return note;
    }))
    setNotes(apiData.data.listNotes.items);
  }

  async function example() {

    let words = require('./words/wordsbylevel.json');
    //let configs = require('./words/config.json')    
    let i = 0;

    let study = [];
    words.map(level=>{
      console.log(indextoname(i,'belong'))
      console.log(level)

      console.log('buscar:',configs[i],'%');
      let word_index = Math.random() * (level.length - 0) + 0;
      i++;
    })

    
    console.log(configs)

    /*configs.map((config,index)=>{
      //console.log(indextoname(index,'belong'))
      ////console.log(config)
      let buscar = true;

      let i = 0;
      while(buscar){
        //console.log(i)

        //Math.random() * (max - min) + min;


        if(i==100){
          buscar = false;
        }
        i++;
      }
    })*/

    try{
      let userinfo = await Auth.currentSession();
    } catch {
      
    }
    
    //console.log(userinfo)
    
  }
  async function createNote() {

    let loggedin = false;
    await Auth.currentSession()
    .then(r=>{
      loggedin = true;
    })
    .catch(e=>{
      loggedin = false;
    })

    console.log(loggedin);
    if(!loggedin){
      //redirect
    }

    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData } });
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
  }

  return (
    <div className="App">
      <h1>My Notes App</h1>

      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Note name"
        value={formData.name}
      />
      <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="Note description"
        value={formData.description}
      />
      <input
        type="file"
        onChange={onChange}
      />
      <button onClick={example}>Example</button>
      <button onClick={createNote}>Create Note</button>
      <div style={{marginBottom: 30}}>
        {
          notes.map(note => (
            <div key={note.id || note.name}>
              <h2>{note.name}</h2>
              <p>{note.description}</p>
              <button onClick={() => deleteNote(note)}>Delete note</button>
              {
                note.image && <img src={note.image} style={{width: 400}} />
              }
            </div>
          ))
        }
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
