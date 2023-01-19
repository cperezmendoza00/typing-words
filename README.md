# Typing words from common lists

React app that plays random words or phrases from English common lists to practice listening and writing. When you type the word correctly you'll see how many mistakes you made in a table.

<img src="https://raw.githubusercontent.com/cperezmendoza00/typing-words/master/screenshoots/demo.png" alt="drawing" width="400"/>


## Instructions:
1. Select a list
2. Select amount of words per level (Change this if you want to get easier or more difficul words/phrases)
3. Listen to a word/phrase
4. Type what you listened. I you type an incorrect letter you are notified with an sound and the color of the incorrect letter will be red. 
5. When the word/phrase is typed correctly, you'll get a new word/phrase.

Available lists:
- Oxford 5000
- Oxford 750 phrases
- Engvid 240 Common Spelling Mistakes
- Lemongrad 200 + Commonly Mispronounced Words

## Configurations:

Add environment variables into .zshrc file before starting the app (using your own aws credentials)
```
export REACT_APP_MY_AWS_REGION="YOUR_REGION"
export REACT_APP_MY_ACCESS_KEY_ID="YOUR_ACCESS_KEY"
export REACT_APP_SECRET_ACCESS_KEY="YOUR_SECRET_ACCESS_KEY"
```



## Details:
- React, Amplify [Following aws example](https://aws.amazon.com/getting-started/hands-on/build-react-app-amplify-graphql/)
- Amazon Polly (Synthesize natural-sounding human speech)


### List selection:
<img src="https://raw.githubusercontent.com/cperezmendoza00/typing-words/master/screenshoots/main.png" alt="drawing" width="400"/>

### Words per level:
<img src="https://raw.githubusercontent.com/cperezmendoza00/typing-words/master/screenshoots/levels.png" alt="drawing" width="400"/>

