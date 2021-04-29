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