var questionData ;
var startQuizSection = document.querySelector('#start-menu')
var quizSection = document.querySelector('#quiz')
var questionContainer = document.querySelector('#questionContainers')
var quizArea = document.querySelector('#quiz')
var questionOnDisplay = document.querySelector('#Question')
var optionDisplay1 = document.querySelector("#option1")
var optionDisplay2 = document.querySelector("#option2")
var optionDisplay3 = document.querySelector("#option3")
var optionDisplay4 = document.querySelector("#option4")
var highscoreList = document.querySelector('#highScoreList')

var submitScorebutton = document.querySelector('#submitScore')

var finshedQuizPage  = document.querySelector('#finished-page')

var startQuizButton = document.querySelector('#start-Quiz')
var loadingText = document.querySelector('#Loading')
var timerDispaly = document.querySelector('#timer')

var highScoreScrren = document.querySelector('#HighScoreScreen')

var goBackButton = document.querySelector('#goBack')
var clearHighScore = document.querySelector('#clearHighScore')

var initalInput = document.querySelector('#inital-Input')

var highscoreLink = document.querySelector('#view-highscore')

var questionQ = []

var performanceHistory = []
var currScore = 0

var inital

var curQuestion;
var questionOrder = []

var correctChoices;

var timerCount = 70;


var timerInterval;


function init(){
    // fetch("./Assets/questions.json").then((res) => {
    //     return res.json()
    // }).then((data) => console.log(data))

    fetch("./Assets/questions.json").then((res) => {
        return res.json()
    }).then((data) => {questionData = data; startQuizButton.disabled = false; loadingText.remove()  })
  
    loadScore()
}


function optionSelect(event){
    var element = event.target;

    if(element.matches('.option')){
        console.log(element.dataset.option)

        if(curQuestion.correctOption === Number(element.dataset.option)){
            //add to correct
            correctChoices++
            console.log('correct')

            goToNextQuestion()

            //go to next question

            timerDispaly.textContent = "Timer: " + timerCount
            
        }else{
            timerCount -= 5
            
            if(timerCount <= 0){
                //end quiz
                //go to the end screen
                
                //******* add the end quiz thing here */
                clearInterval(timerInterval)
        
                //close
                quizSection.className = 'display-none'
                finshedQuizPage.className = ''

                timerDispaly.textContent = 'Timer: ' + 0
        
            }else{
                timerDispaly.textContent = 'Timer: ' + timerCount

                goToNextQuestion()
    
                //if the timer is lesser than go to 
                
    
                console.log('wrong')
                //go to next questoin
            }

        }
    }
}

function timer(){
    timerCount--

    timerDispaly.textContent = 'Timer: ' + timerCount 
    
    if(timerCount <= 0){
        //end quiz
        //go to the end screen

        //******* add the end quiz thing here */
        clearInterval(timerInterval)

        //close
        quizSection.className = 'display-none'
        finshedQuizPage.className = ''

    }
}

function startQuiz(event){
    //start a internval
    // console.log('zxcvzcvzcxv')

    highscoreLink.className = 'display-none'
    
    
    timerInterval = setInterval(timer,1000)

    timerCount = 30
    timerDispaly.textContent = "Timer: " + timerCount

    questionQ = [];




    //get a set of questions 
        //make random q of questions

    for(let i = 0; i < 5; i++){
        
        let qeustion = questionData[Math.floor(Math.random()*questionData.length)];

        if(!questionOrder.includes(qeustion)){
            questionOrder.push(qeustion)
        }else{
            i--
        }
       
       
    }

    console.log(questionOrder.length)
    console.log(questionOrder)

    // questionOrder.forEach((e)=> {
    //     console.log(e)
    // })

    // curQuestion = questionOrder.pop()

   
    //go to questions and answers area

    goToNextQuestion()

    startQuizSection.className = 'display-none'
    
    quizSection.className = ''


    console.log(questionData)
}

function goToNextQuestion(){

    if(questionOrder.length === 0){
        //change page and go to next one
        clearInterval(timerInterval)

        
        quizSection.className = 'display-none'
        displayFinshedSection()

    }else{
        curQuestion = questionOrder.pop()

        questionOnDisplay.textContent = curQuestion.question
        optionDisplay1.textContent = curQuestion.option1
        optionDisplay2.textContent = curQuestion.option2
        optionDisplay3.textContent = curQuestion.option3
        optionDisplay4.textContent = curQuestion.option4
        
    }

    
}

function displayFinshedSection(){
    var finalScoreText = document.querySelector('#finalScoreText')
    
    finalScoreText.textContent = 'Your final score is: ' + timerCount;

    currScore = timerCount

    finshedQuizPage.className = ''
}

function saveStats(){
    localStorage.setItem('quizScore', JSON.stringify([...performanceHistory]))
}

function retriveScore(){
    performanceHistory = localStorage.getItem('quizScore')
}

function addToHighScoreList(inital, score){
    
    var newListItem = document.createElement('li')
    newListItem.textContent = `${inital} -  ${score}`
    highscoreList.append(newListItem)
}

function goToQuizScreen(){
    //stop displaying  highScoreScrren
  

    highScoreScrren.className = 'display-none'
    
    startQuizSection.className = ''
}

function loadScore(){
    if(localStorage.getItem('quizScore') !== null){
        performanceHistory = JSON.parse(localStorage.getItem('quizScore'))
        console.log(performanceHistory)

        performanceHistory.forEach(element => {
           addToHighScoreList(element.atmpInital, element.score)
        });


    }else{
        performanceHistory = []
    }
    // console.log(performanceHistory)
    
}

function clearHighScoreHistory(){
    
    
    
    while(highscoreList.firstChild){
        highscoreList.removeChild(highscoreList.firstChild)
    }


    localStorage.removeItem('quizScore')
    //clear local storage

}

function submitScore(){
    //add to 

    if(initalInput.value === ''){
        alert('Please input a inital')
        return 0 
    }

    let newStat = {score: currScore , atmpInital: initalInput.value }

    performanceHistory.push(newStat)
    saveStats()
    console.log(performanceHistory)
    
    addToHighScoreList(newStat.atmpInital, newStat.score)
    console.log('added submit')
    
    initalInput.value = ''

    finshedQuizPage.className = 'display-none'

    //go to the highscore area if saved info
    highScoreScrren.className = ''
}


function viewHighScore(){
    //disable current screen
    startQuizSection.className = 'display-none'

    highScoreScrren.className = ""

}


questionContainer.addEventListener("click", optionSelect)

startQuizButton.addEventListener('click', startQuiz)

goBackButton.addEventListener('click', goToQuizScreen )

clearHighScore.addEventListener('click',clearHighScoreHistory )

submitScorebutton.addEventListener('click', submitScore)

highscoreLink.addEventListener('click', viewHighScore)


init()

