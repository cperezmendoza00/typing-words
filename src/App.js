import React, { useState, useEffect } from 'react';
import 'fontsource-roboto';
import './App.css';

import {API, Auth} from 'aws-amplify';
import { withAuthenticator, AmplifySignOut, AmplifyAuthenticator} from '@aws-amplify/ui-react';
import awscredentials from './aws-credentials';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';


import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';
import MoreIcon from '@material-ui/icons/MoreVert';
import MailIcon from '@material-ui/icons/Mail';
import { getResult } from './graphql/queries';
import { 
  createResult as createResultMutation, 
  updateResult as updateResultMutation 
} from './graphql/mutations';




import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';


import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';


import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';


import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const AWS = require('aws-sdk')

AWS.config.update(awscredentials);
const Polly =  new AWS.Polly({
  region: awscredentials.region
})


const options = [
  {
    id:'oxford500',
    name:'Oxford 5000'
  },
  {
    id:'ofxfordphrases',
    name:'Oxford 750 phrases'
  },
  {
    id:'engvid240spelling',
    name:'Engvid 240 Common Spelling Mistakes'
  },
  {
    id:'lemongrad200pronunciation',
    name:'Lemongrad 200 + Commonly Mispronounced Words'
  },
  {
    id:'mywords',
    name:'My words'
  }
]

let study = [];
let index = -1;
let word_counter = 0;
let text_colors = [];
let button_next = 'Start'
let readonly = false;
let sound_ok = new Audio('/success.wav');
sound_ok.volume = 1; 
let option_selected = '';


let sound_error = new Audio('/error.flac');
sound_error.volume = 0.05; 

//let words = require('./words/wordsbylevel.json');



const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  root: {
    width: 200,
  },

  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

const initialFormState = { text: ''}
function App() {

  
  useEffect(() => {

    onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData)
    });

    let user_payload = {}
    console.log('Searching for user data...')
    Auth.currentSession()
    .then(async r=>{
      user_payload = r.accessToken.payload
      setUser(user_payload)

      console.log('Searching for user resutls...')
      let apiData = await API.graphql({ query: getResult,variables: { id: user_payload.sub }});
      let items = [];
      if(apiData.data.getResult !== null) {
        items = apiData.data.getResult;
      }
      console.log('User results:',items)
      setResults(items)
      
      handleClose();


    })
    .catch(e=>{
      console.log('User is not logged')
      handleClose();
    })
  }, []);

  
  const [current_word, setCurrentWord] = useState({word:'Empezar'});
  const [last_words, setLastWords] = useState([]);
  const [formData, setFormData] = useState( initialFormState);
  const [showOxfordConfig,setShowOxfordConfig] = useState(false)
  const [showOxfordPlay,setShowOxfordPlay] = useState(false)
  const [rounds,setRounds] = useState(0);
  const [current_audio, setcurrent_audio] = useState(null);
  const [results, setResults] = useState([]);
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();
  const [title, setTitle] = React.useState();

  const classes = useStyles();
  
  //STATES SLIDERS
  const [configOxfordA1,setConfigOxfordA1] = React.useState(10);
  const [configOxfordA2,setConfigOxfordA2] = React.useState(20);
  const [configOxfordB1,setConfigOxfordB1] = React.useState(30);
  const [configOxfordB2,setConfigOxfordB2] = React.useState(30);
  const [configOxfordC1,setConfigOxfordC1] = React.useState(10);


 
  //STATE LOADING
  const [open, setOpen] = React.useState(true);


  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  //HOOKS SLIDERS
  const handleChangeSliderA1 = (event, newValue) => { setConfigOxfordA1(newValue) }
  const handleChangeSliderA2 = (event, newValue) => { setConfigOxfordA2(newValue) }
  const handleChangeSliderB1 = (event, newValue) => { setConfigOxfordB1(newValue) }
  const handleChangeSliderB2 = (event, newValue) => { setConfigOxfordB2(newValue) }
  const handleChangeSliderC1 = (event, newValue) => { setConfigOxfordC1(newValue) }

  //HOOKS LOADING
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };
  
  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem >
    {
    authState === AuthState.SignedIn && user ? (
          <div className="App">
              <div>Hello, {user.username}</div>
              <AmplifySignOut />
          </div>
        ) : (
          <AmplifyAuthenticator />
      )
    }
</MenuItem>
      
    </Menu>
      
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );




  function ValueLabelComponent(props) {
    const { children, open, value } = props;
  
    return (
      <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
        {children}
      </Tooltip>
    );
  }
  
  ValueLabelComponent.propTypes = {
    children: PropTypes.element.isRequired,
    open: PropTypes.bool.isRequired,
    value: PropTypes.number.isRequired,
  };



  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {options.map((option, index) => {
          if( option.id !== 'mywords' || (user !== undefined && option.id === 'mywords') ) {
            return (
            <ListItem button key={option.id} onClick={(e) => configOption(option)} >
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={option.name} />
            </ListItem>
            )

          }
          
        })
        }
      </List>
    </div>
  );
  
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
      VoiceId: "Kendra"
    };


    var signer = new AWS.Polly.Presigner(params, Polly)
    return await signer.getSynthesizeSpeechUrl(params);
    
  }

  function next(){

    //console.log('next:',index,'word counter:',word_counter)
    //AQUI ESTABA OK
    if(index < 0){
      reset()
      button_next = 'Play again'
        
    } else {
      word_counter++;
      if(typeof study[index] !=="undefined"){
        if(typeof study[index].checked === "undefined") {
          //study[index].checked = false
        } else {
          //study[index].index = false
        }

        //AQUI YA SE LE AGREGÓ EL INDEX
        
        const new_last_words = {
          ...study[index],
          index : word_counter,
          round:rounds,
          errors:current_word.errors !== undefined ? current_word.errors : 0
        }

        last_words.unshift(new_last_words)
        setLastWords(last_words);
        if(typeof current_word.errors === "undefined" ) {
          //current_word.errors = 1;
        }
        if(typeof current_word.checked === "undefined" ) {
          current_word.checked = false;
        }
        //AQUI YA TIENE errores
        if(results.length !== 0){
          results.lists.map(levels=>{
            if(levels.name === current_word.belongto){
              current_word.checked = levels.data.some(word=> word.word === current_word.word)
            }
            return levels
          })
        }


      }
      if((index+1) === study.length) {
        reset()
      }
    }

  
    
    index++;
    text_colors = []
    if(typeof study[index] !=="undefined"){
      
      const current_study = {...study[index]}
      setCurrentWord(current_study);
      if(typeof current_study.phonetic!== "undefined"){
        setTitle(current_study.phonetic)
      }
      
      getaudio(current_study.word)
      .then(url=>{
        if(url) {
          let audio = new Audio(url);
          audio.play()
          setcurrent_audio(audio)
          setFormData(initialFormState);
        }
      })
    }

  }

  function validate(e){
    if(!readonly){
      text_colors = [];
      if(typeof current_word.errors === "undefined" ) {
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
  }

  function enterpressed(e){
    if(e.charCode === 13) {
      current_audio.play()
    }
  }

  function reset(){


    let words = [];
    
    let configs=[
      configOxfordA1,
      configOxfordA2,
      configOxfordB1,
      configOxfordB2,
      configOxfordC1
    ];
    console.log('reset')
    study = [];
    index = -1
    setRounds(rounds+1)
    setTitle(undefined)
    if(option_selected==="mywords"){
      if(typeof results.lists !== "undefined") {
        //copy of the array
        words = [...results.lists];
      }

      let i = 0;
      words.map(level=>{
        level.data.map(word_in_level=>{
          study.push(word_in_level)    
          return word_in_level
        })
           
        i++;
        return level
      })
      
    } else if(option_selected==="ofxfordphrases") {
      words = require('./words/phrasesbylevel.json');
      for (let level in words) {
        let i = 0;
        let study_by_level = [];
        words[level].list.map(word=>{
          study.push({word:word,belongto:level})
          
          i++;
          return word
        })
      }

    } else if(option_selected==="engvid240spelling") {
      words = require('./words/misspelled.json');
      words.map(word=>{
        study.push({word:word,belongto:'engvid'})    
          
        return word
      })


    } else if(option_selected==="lemongrad200pronunciation") {
      words = require('./words/misspronunced.json');
      words.map(word=>{
        study.push({word:word.word,belongto:'lemongrad',phonetic:word.phonetic})    
          
        return word
      })

    } else {
      words = require('./words/wordsbylevel.json');
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
        return level
      })
    }

    

    //study.unshift({word:'able',belongto:'a1'})
    //study.unshift({word:'able',belongto:'a1'})
    study = shuffle(study)
  }

  function configOption(selected){

    setLastWords([])
    setcurrent_audio(null)
    index = -1;

    setShowOxfordConfig(false)
    setShowOxfordPlay(false)

    option_selected = selected.id
    if(option_selected==="oxford500") {
      if(!showOxfordConfig) setShowOxfordConfig(true)
    } else {
      startOxfordPlay()
    }

    
  }

  async function startOxfordPlay() {
      
      
    

      setShowOxfordConfig(false)
      setShowOxfordPlay(true)
      next()

    
  }

  async function checkboxpreesed(index_last_word){
    
    handleToggle();
    
    let new_last_words = [ ...last_words ];
    
    if(new_last_words[index_last_word].checked) new_last_words[index_last_word].checked = false; else new_last_words[index_last_word].checked = true
    let checked = new_last_words[index_last_word].checked;
    
    //new_last_words[index_last_word].checked = checked;
    //Modify item in array set state: Destructuring
    //#changestate #arraystate      
    setLastWords(new_last_words);
    if (results.length === 0) {
      //create an element
      let data = {
        id: user.attributes.sub,
        username:user.username,
        lists:[{
          name:last_words[index_last_word].belongto,
          data:[{
            word: last_words[index_last_word].word,
            belongto: last_words[index_last_word].belongto,
            checked: true
          }]
        }]
      }
      await API.graphql({ query: createResultMutation, variables: { input: data } })
      .then(r=>{
        setResults(data)
      })
      .catch(r=>{console.log(r)})

    } else {
      let existe_nivel = results.lists.some(level=> level.name === last_words[index_last_word].belongto);
      if(!existe_nivel){
        //Agrego el nuvel si no existe
        results.lists.push({name:last_words[index_last_word].belongto,data:[]})
      }

      if(checked) {
          results.lists.map((levels,index)=>{
            if(levels.name === last_words[index_last_word].belongto) {
              if(!levels.data.some(word=> word.word === last_words[index_last_word].word)) {
                //Agregar la palabra al indice
                results.lists[index].data.push({
                  word:last_words[index_last_word].word,
                  belongto:last_words[index_last_word].belongto,
                  checked: true,
                })
              }
            }
            return levels;
          });
          let data = {
            id: user.attributes.sub,
            username:user.username,
            lists:results.lists
          }
          await API.graphql({ query: updateResultMutation, variables: {input: data} })
          .then(r=>{
            setResults(data)
          })
          .catch(r=>{console.log(r)})
      } else {
        //eliminar
        if(existe_nivel){
          results.lists.map((levels,index)=>{
            if(levels.name === last_words[index_last_word].belongto) {
              levels.data.map((word,index_word)=> {
                if(word.word === last_words[index_last_word].word) {
                  //Eliminar la palabra del indice
                  results.lists[index].data.splice(index_word, 1);
                } 
                return word;
              })
            }
            return levels;
          });
          
          let data = {
            id: user.attributes.sub,
            username:user.username,
            lists:results.lists
          }
          await API.graphql({ query: updateResultMutation, variables: {input: data} })
          .then(r=>{
            setResults(data)
          })
          .catch(r=>{console.log(r)})
        }
      }
    }
    handleClose();
  }

  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  return (
    <div className="App">
      <Backdrop className={classes.backdrop} open={open}>
          <CircularProgress color="inherit" />
      </Backdrop>

      <Drawer anchor="left" open={state["left"]} onClose={toggleDrawer("left", false)}>
        {list("left")}
      </Drawer>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer('left', true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            Write what you hear
            { 
              showOxfordPlay &&
              current_audio !== null &&
              <label> - Round {rounds}</label>
            }
          </Typography>
          <div className={classes.grow} />
          
          <div className={classes.sectionDesktop}>

            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      { 
        renderMenu
      }

      { !showOxfordConfig && !showOxfordPlay &&
          options.map(option=> {
            if( option.id !== 'mywords' || (user !== undefined && option.id === 'mywords') ) {
              return (
                <button key={option.id} className="buttons" onClick={(e) => configOption(option)}>{option.name}</button>
              )
          }
        })
         
      }
      { showOxfordConfig &&
      <div className="sliders">
        <h3><Typography>Words per round</Typography></h3>

        <Grid container spacing={2}>
          <Grid item><Typography>A1</Typography></Grid>
          <Grid item xs>
            <Slider ValueLabelComponent={ValueLabelComponent} value={configOxfordA1} onChange={handleChangeSliderA1} aria-labelledby="continuous-slider"  />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item><Typography>A2</Typography></Grid>
          <Grid item xs>
            <Slider ValueLabelComponent={ValueLabelComponent} value={configOxfordA2} onChange={handleChangeSliderA2} aria-labelledby="continuous-slider"  />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item><Typography>B1</Typography></Grid>
          <Grid item xs>
            <Slider ValueLabelComponent={ValueLabelComponent} value={configOxfordB1} onChange={handleChangeSliderB1} aria-labelledby="continuous-slider"  />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item><Typography>B2</Typography></Grid>
          <Grid item xs>
            <Slider ValueLabelComponent={ValueLabelComponent} value={configOxfordB2} onChange={handleChangeSliderB2} aria-labelledby="continuous-slider"  />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item><Typography>C1</Typography></Grid>
          <Grid item xs>
            <Slider ValueLabelComponent={ValueLabelComponent} value={configOxfordC1} onChange={handleChangeSliderC1} aria-labelledby="continuous-slider"  />
          </Grid>
        </Grid>
      </div>
      }

      { showOxfordConfig &&
        <button onClick={startOxfordPlay}  className="buttons" >Start</button>
      }

      

    
    <div className="divTitle_text">
      { current_audio !== null &&

        <label className="title_text"><Typography >What did you hear? <label>{title}</label></Typography> </label>
      }
    </div>
    <div className="text_container">
    
      { current_audio !== null &&
        <input className="write"
          onChange={validate}
          onKeyPress={(e) => enterpressed(e)} 
          value={formData.text}
         
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
    <div className="buttonsPlayAndNext">
      { 
        showOxfordPlay &&
        current_audio !== null &&
        <Tooltip title="Press enter to play the audio again" placement="top-start">
          <button className="buttonsPlayAndNext" onClick={play}>{button_next}</button>
        </Tooltip>
      }

      { showOxfordPlay &&
        <button className="buttonsPlayAndNext" onClick={next}>Next word</button>
    }
    </div>
    { last_words.length > 0 &&
      <div className="table_words">
        <div className="table_titles">
            <div>Round</div>
            <div>Errors</div>
            <div className="wordBigger">Word <label className="belong">(Level)</label></div>
            {
              user !== undefined &&
              <div>Favourite</div>
            }
            
          </div>
        <div className="results_table_words">
        {
          last_words.map((last_word,index_last_word) => (
            <div key={last_word.word+index_last_word }>
              <div>{last_word.round} - {last_word.index}</div>
              <div>{last_word.errors}</div>
              <div className="wordBigger">{last_word.word} <label className="belong">({last_word.belongto})</label></div>
              
              {
              user !== undefined &&
              <div className="favourite">
                <label>
                  { !last_word.checked &&
                    <FavoriteBorder onClick={e=>checkboxpreesed(index_last_word)} />
                  }

                  { last_word.checked &&
                    <Favorite onClick={e=>checkboxpreesed(index_last_word)}  />
                  }
                </label>
              </div>
              }
              
            </div>
          ))
        }
        </div>
      </div>
    }

    
    </div>
  );
}

export default App;

//export default withAuthenticator(App);

