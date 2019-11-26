const questionnaire_element = document.getElementById("questionnaire");

const SOFT_SKIP_WARNING = "Oh dear!  Are you sure you don't wan't to answer this question.";
const HARD_SKIP_WARNING = "Please answer this question.";
const START_QUESTION_TEXT = "Let's get started!";
const SUBMIT_TEXT = "Submit Questionnaire";
const TEXT_AREA_MARKDOWN = "__";
const TEXT_FIELD_MARKDOWN = "==";

class Questionnaire{
    constructor(welcome,questions,thankYou){
	this._welcome=welcome;
	this._questions=questions;
	this._thankYou = thankYou;

	for ( let question of this._questions){
	    console.log("... adding question... "+question.id);
	}
	this.linkQuestions();
	this.createElement();
    }

    linkQuestions(){
	let previousQuestion = null;
	for (let question of this._questions){
	    question.previous = previousQuestion;
	    if (previousQuestion){
		previousQuestion.next=question;
	    }
	    previousQuestion=question;
	    console.log(question);
	}
    }
    
    createElement(){
	let welcomeElement = document.createElement("div");
	welcomeElement.id="welcome";
	welcomeElement.innerHTML += this._welcome;
	let startButtonElement = document.createElement("input");
	startButtonElement.type = "button";
	startButtonElement.value = START_QUESTION_TEXT;
	startButtonElement.gotoId=this._questions[0].id;
	startButtonElement.onclick=function(){
	    document.getElementById(this.gotoId).classList.add("active");
	    document.getElementById("welcome").style.display="none";
	};
	welcomeElement.appendChild(startButtonElement);
	questionnaire_element.appendChild(welcomeElement)

	for (let question of this._questions){
	    question.createElement();
	}

	let thankYouElement = document.createElement("div");
	thankYouElement.id="thankYou";
	thankYouElement.innerHTML += this._thankYou;
	questionnaire_element.appendChild(thankYouElement);
    }

    get questions(){
	return(this._questions);
    }
    
    getQuestionById(id){
	for (let question of this._questions){
	    if (id == question.id){
		return(question);
	    }
	}
	return null;
    }
    
    submitResults(){
	alert("NEED TO HANDLE RESULTS");	
    }
}

class Question{
    constructor(id,text,skipType="",multipleChoice=false,answers=[]){
	this._id = id;
	this._text = text;
	this._skipType = skipType;
	this._multipleChoice = multipleChoice;
	if (this._multipleChoice){
	    this._selectedAnswer = [];
	} else{
	    this._selectedAnswer = null;
	}
	this._answers = answers;
	this._previousQuestion = null;
	this._nextQuestion = null;
    }

    set answers(answers){
	this._answers = _answers;
    }

    set previous(question){
	this._previousQuestion=question;
    }

    get previous(){
	return(this._previousQuestion);
    }
    set next(question){
	this._nextQuestion=question;
    }
    get next(){
	return(this._nextQuestion);
    }

    get id(){
	return(this._id);
    }
    get skipType(){
	return(this._skipType);
    }

    get selectedAnswer(){
	return(this._selectedAnswer);
    }

    addSelectedAnswer(answer){
	if (this._multipleChoice){
	    // if the user selected none of the above,
	    // OR the selected answer is none of the above
	    // clear all answers then add the select...
	    if (answer.noneOfAbove ||
		(this._selectedAnswer.length>0 && this._selectedAnswer[0].noneOfAbove) ){
		this._selectedAnswer.length=0;
	    }
	    
	    // if the anwswer was already selected...
	    // turn it off, otherwise add it...	   
	    let indx=this._selectedAnswer.indexOf(answer);
	    if (indx>-1){
		this._selectedAnswer.splice(indx,1)
	    } else{
		this._selectedAnswer.push(answer);
	    }
	}else{
	    this._selectedAnswer = answer;
	}
    }

    removeSelectedAnswer(answer){
	if (this._multipleChoice){
	    let indx=this._selectedAnswer(answer);
	    if (indx>-1){
		this._selectedIndx.splice(indx,1)
	    }
	}
    }

    isSelected(){
	if (this._multpleChoice){
	    console.log("mc:"+this._selectedAnswer.length);
	}  else{
	    console.log("not mc:"+this._selectedAnswer);
	}
	return (this._multipleChoice)?this._selectedAnswer.length>0:this._selectedAnswer!==null;
    }

    selectId(answerId){
	for ( let answer of this._answers ){
	    if (answer.id === answerId) {
		this.addSelectedAnswer(answer);
		return;
	    }
	}
    }
    
    createElement(){
	let questionElement = this.createQuestionElement();
	for ( let answer of this._answers){
	    let answerElement = this.createAnswerElement(answer);
	    questionElement.appendChild(answerElement)
	}
	this.addNavigationButtons(questionElement);
    }

    createQuestionElement(){
	let questionElement = document.createElement("div");
	questionElement.classList.add("question");
	questionElement.innerHTML += this._text;
	questionElement.id = this._id;

	questionnaire_element.appendChild(questionElement);
	return(questionElement);
    }

    createTextElement(answer){
	let myText = answer.text;
	let textElement=null;
	
	if ( myText.startsWith(TEXT_AREA_MARKDOWN) || myText.startsWith(TEXT_FIELD_MARKDOWN) ){
	    if (myText.startsWith(TEXT_AREA_MARKDOWN)){
		myText=myText.substring(TEXT_AREA_MARKDOWN.length);
		textElement = document.createElement("textarea");
	    } else if (myText.startsWith(TEXT_FIELD_MARKDOWN)){
		myText=myText.substring(TEXT_FIELD_MARKDOWN.length);
		textElement = document.createElement("input");
		textElement.type = 'text';
	    }

	    // add attributes of the onclick function
	    textElement.answerId = answer.id;
	    textElement.questionId = this.id;
	    textElement.onclick=function(){
		document.getElementById(this.answerId).checked=true;
		q.getQuestionById(this.questionId).selectId(this.answerId);
		console.log(this.answerId+" "+this.answerId.checked);
	    }

	}
	
	return {text:myText,element:textElement};
    }
    
    createAnswerElement(answer){
	let answerDivElement = document.createElement("div");
	answerDivElement.classList.add("response");
	
	let answerElement = document.createElement("input");
	answerElement.type = (this._multipleChoice)?"checkbox":"radio";
	answerElement.id=answer.id;
	answerElement.name = this._id;
	answerElement.onclick = function(){
	    let question = q.getQuestionById(this.name);
	    console.log(q+"\n"+question);

	    question.addSelectedAnswer(answer);
            // check if we want to change next/previous button....
	    if (!question.multipleChoice && question.next){
		console.log(question.selectedAnswer);
		if (question.selectedAnswer.skipToId){
		    document.getElementById(question.id+"_next").gotoId =
			question.selectedAnswer.skipToId;
		    document.getElementById(question.selectedAnswer.skipToId+"_prev").gotoId =
			question.id;
		} else{
		    let qid=document.getElementById(question.id+"_next").gotoId;		    
		    document.getElementById(qid+"_prev").gotoId =
			q.getQuestionById(qid).previous.id;		    
		    document.getElementById(question.id+"_next").gotoId =
			question.next.id;

		}
	    }
	}
	
	/* handle Textbox/Text input */
	let textObject = this.createTextElement(answer);
	if (textObject.element !== null){
	    answerDivElement.classList.add("freeresponse");
	    answerDivElement.appendChild(textObject.element);
	}
	
	let labelElement=document.createElement("label")
	labelElement.htmlFor = answer.id;
	labelElement.innerHTML = textObject.text;

	answerDivElement.appendChild(answerElement);
	answerDivElement.appendChild(labelElement);

	return(answerDivElement);
    }


        /* create a "prev" or next button */
    buildNavigationButton(nextQuestion,skipType){
	let nextButtonElement = document.createElement("button");

	console.log(this.id+": "+skipType+" "+nextQuestion)
	nextButtonElement.currentId = this.id
	nextButtonElement.gotoId = nextQuestion.id;
	nextButtonElement.skipType = skipType;
	nextButtonElement.onclick=function(){
	    let currentQuestionElement = document.getElementById(this.currentId);
	    let nextQuestionElement = document.getElementById(this.gotoId);

	    
	    // if the skipType is set, handle it...
	    if (nextQuestionElement != null){
		console.log(this+"\n"+this.skipType+" "+this.currentId+
			    "\n"+ q.getQuestionById( this.currentId ).isSelected() +
			   " "+this.skipType);
		// if there is a selected answer, we dont care
		// about the skip type...
		if ( !q.getQuestionById( this.currentId ).isSelected() ){
		    if ( this.skipType === "hard" ){
			alert(HARD_SKIP_WARNING);
			return
		    } else if ( this.skipType === "soft" ){
			let response=confirm(SOFT_SKIP_WARNING);
			if (!response) {
			    return;
			}
		    }
		}

		currentQuestionElement.classList.remove('active');
		nextQuestionElement.classList.add('active');
	    }
	}
	return nextButtonElement;
    }

    addSubmitButton(questionElement){
	let submitButtonElement = document.createElement("input");
	submitButtonElement.type="submit";
	submitButtonElement.value=SUBMIT_TEXT;
	submitButtonElement.currentId=this.id;
	submitButtonElement.onclick=function(){
	    console.log("...... submit form ..... ");

	    let currentQuestionElement = document.getElementById(this.currentId);
	    let thankYouElement = document.getElementById("thankYou");
	    currentQuestionElement.classList.remove('active');
	    thankYouElement.classList.add('active');
	    
	    q.submitResults();
	}

	questionElement.appendChild(submitButtonElement);
    }
    
    addNavigationButtons(questionElement){

	/* Build the back and forward button */
	if (this.previous !== null){
	    let prevButtonElement = this.buildNavigationButton(this.previous,"");
	    prevButtonElement.classList.add("previous");
	    prevButtonElement.innerHTML="&lt;&lt;prev";
	    prevButtonElement.id=this.id+"_prev";
	    questionElement.appendChild(prevButtonElement);
	}
	
	if (this.next !== null){
	    let nextButtonElement = this.buildNavigationButton(this.next, this.skipType);
	    nextButtonElement.innerHTML="next&gt;&gt;";
	    nextButtonElement.classList.add("next");
	    nextButtonElement.id=this.id+"_next";
	    questionElement.appendChild(nextButtonElement);
	} else {
	    this.addSubmitButton(questionElement);
	}
    }

}




class Answer{
    constructor(id,text,value,skipToQuestionId=null,noneOfAbove=false){
	this._id = id;
	this._text = text;
	this._value = value;
	this._skipToQuestionId = skipToQuestionId;
	this._noneOfAbove = noneOfAbove;
    }
    
    get noneOfAbove(){
	return(this._noneOfAbove);
    }

    get skipToId(){
	return this._skipToQuestionId;
    }

    get text(){
	return this._text;
    }

    get id(){
	return this._id;
    }
}

