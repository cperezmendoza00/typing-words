/*

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
        last_words.map((last_word,index_last_word) => (
          <div key={last_word.word+index_last_word }>
            <div>{last_word.index}</div>
            <div>{last_word.word} <label className="belong">({last_word.belongto})</label></div>
            <div>{last_word.errors}</div>
          </div>
        ))
      }
      </div>
    </div>
  }

  */