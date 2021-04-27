import React, { useState } from 'react';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import awscredentials from './aws-credentials';

const AWS = require('aws-sdk')

AWS.config.update(awscredentials);
const Polly =  new AWS.Polly({
  region: awscredentials.region
})



let study = [];
let index = -1;
let word_counter = 0;
let text_colors = [];
let button_next = 'Start'
let readonly = false;
let sound_ok = new Audio('/success.wav');
sound_ok.volume = 1; 

let sound_error = new Audio('/error.flac');
sound_error.volume = 0.05; 

let words = require('./words/wordsbylevel.json');
let configs = require('./words/config.json')    




const initialFormState = { text: ''}
function App() {

  const [current_word, setCurrentWord] = useState({word:'Empezar'});
  const [last_words, setLastWords] = useState([]);
  const [formData, setFormData] = useState( initialFormState);
  const [current_audio, setcurrent_audio] = useState(null);
  
  
  
  function play(){
    if(current_audio !== null) {
      current_audio.play();
    }    
  }

  async function getaudio(text){
    var params = {
      OutputFormat: "mp3", 
      SampleRate: "24000", 
      Text: text,
      TextType: "text", 
      VoiceId: "Joanna"
    };
    var signer = new AWS.Polly.Presigner(params, Polly)
    return await signer.getSynthesizeSpeechUrl(params);
  }

  function next(){
    if(index < 0){
      reset()
      button_next = 'Play again'
    } else {
      word_counter++;
      if(typeof study[index].index === "undefined") {
        study[index].index = word_counter
      } else {
        study[index].index = word_counter
      }
      last_words.unshift(study[index])
      setLastWords(last_words);
      if(typeof current_word.errors == "undefined" ) {
        current_word.errors = 1;
      }

      if((index+1) === study.length) {
        reset()
      }
    }
    index++;
    text_colors = []

    setCurrentWord(study[index]);
    getaudio(study[index].word).then(url=>{
      let audio = new Audio(url);
      audio.play()
      setcurrent_audio(audio)
      setFormData(initialFormState);
    })
  }

  function validate(e){
    text_colors = [];
    if(typeof current_word.errors == "undefined" ) {
      current_word.errors = 0;
    }
    let error = false;
    for(let i = 0; i< e.target.value.length; i++){
      let letter = e.target.value[i];
      if(current_word.word[i] === e.target.value[i]) {
        text_colors.push({ok:true,letter:letter===' ' ? '   ':letter})
      } else {
        text_colors.push({ok:false,letter:letter===' ' ? '   ':letter})
        sound_error.play()
        error = true;
      }
    }
    if(error) current_word.errors++;


    if(e.target.value === current_word.word ) {
      sound_ok.play()
      readonly = true;
      text_colors = []
      setTimeout(()=>{
        readonly = false;
        next()
      },250)
      
    }
    setFormData({ ...formData, 'text': e.target.value})
  }

  function handler(e){
    if(e.charCode === 13) {
      current_audio.play()
    }
  }

  function reset(){
    console.log('reset')
    study = [];
    index = -1
    let i = 0;
    words.map(level=>{
      let study_by_level = [];
      while(study_by_level.length < configs[i]) {
        let word_index = Math.floor((Math.random() * (level.length - 0) + 0));
        study_by_level.push(level[word_index])
        study.push(level[word_index])    
      }
      //study.push(study_by_level)
      i++;
    })
  }



  return (
    <div className="App">
      <AmplifySignOut />
      <h1>Write what you hear</h1>
  
      { current_audio !== null 
        &&
        <button className="buttons" onClick={play}>{button_next}</button>
      }
      <div className="text_container">
        { current_audio !== null &&

          <input className="write"
            onChange={validate}
            onKeyPress={(e) => handler(e)} 
            value={formData.text}
            readOnly = {readonly}
          />
        }
        { current_audio !== null &&
          <div className="write">{
            text_colors.map((letter,index_text_colors) => (
              <label key={letter.letter + index_text_colors}>
              { 
                letter.ok && <label className="letter_green">{letter.letter}</label> 
              }
              { 
                !letter.ok && <label className="letter_red">{letter.letter}</label> 
              }
              </label>
            ))
          }</div>
        }
      </div>
      <button className="buttons" onClick={next}>Next word</button>
      { last_words.length > 0 &&
        <div className="table_words">
          <div className="table_titles">
              <div>#</div>
              <div>Word <label className="belong">(Level)</label></div>
              <div>Errors</div>
            </div>
          <div className="results_table_words">
          {
            last_words.map((last_word) => (
              <div key={last_word.word }>
                <div>{last_word.index}</div>
                <div>{last_word.word} <label className="belong">({last_word.belongto})</label></div>
                <div>{last_word.errors}</div>
              </div>
            ))
          }
          </div>
        </div>
      }
    </div>
  );
}

function nametoindex(name,type){
  let index = null;
  if(type === 'belong'){
    if(name === "a1") index = 0;
    if(name === "a2") index = 1;
    if(name === "b1") index = 2;
    if(name === "b2") index = 3;
    if(name === "c1") index = 4;
  }
  if(type === 'desc'){
    if(name === "adverb") index = 1;
    if(name === "auxiliary verb") index = 2;
    if(name === "conjunction") index = 3;
    if(name === "definite article") index = 4;
    if(name === "determiner") index = 5;
    if(name === "exclamation") index = 6;
    if(name === "indefinite article") index = 7;
    if(name === "infinitive marker") index = 8;
    if(name === "linking verb") index = 9;
    if(name === "modal verb") index = 10;
    if(name === "noun") index = 11;
    if(name === "number") index = 12;
    if(name === "ordinal number") index = 13;
    if(name === "preposition") index = 14;
    if(name === "pronoun") index = 15;
    if(name === "verb") index = 16;
  }
  return index
}

function indextoname(index,type){
  let name = null;
  if(type === 'belong'){
    if(index === 0) name = "a1";
    if(index === 1) name = "a2";
    if(index === 2) name = "b1";
    if(index === 3) name = "b2";
    if(index === 4) name = "c1";
  }
  if(type === 'desc'){
    if(index === 0) name ="adverb";
    if(index === 1) name = "auxiliary verb";
    if(index === 2) name = "conjunction";
    if(index === 3) name = "definite article";
    if(index === 4) name = "determiner";
    if(index === 5) name = "exclamation";
    if(index === 6) name = "indefinite article";
    if(index === 7) name = "infinitive marker";
    if(index === 8) name = "linking verb";
    if(index === 9) name = "modal verb";
    if(index === 10) name = "noun";
    if(index === 11) name = "number";
    if(index === 12) name = "ordinal number";
    if(index === 13) name = "preposition";
    if(index === 14) name = "pronoun";
    if(index === 15) name = "verb";
  }
  return name
}

export default withAuthenticator(App);
