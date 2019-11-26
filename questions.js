var q = new Questionnaire(
    "<div><bold>Thank</bold> you for volunteering to fill out this survey. It contains 4 questions and is very easy to fill out. </div>",
    [ new Question("q1","Q1. How do you feel today?","hard",false,
		      [  new Answer("Q1_A1","Aweful",-2), new Answer("Q1_A2","Bad",-1,"q3"),
			 new Answer("Q1_A3","ok",0),new Answer("Q1_A4","Good",1),
			 new Answer("Q1_A5","Great",2)]),
      new Question("q2","Q2. How is the weather?","soft",false,
		      [  new Answer("Q2_A1","Aweful",-2), new Answer("Q2_A2","Bad",-1),
			 new Answer("Q2_A3","ok",0),new Answer("Q2_A4","Good",1),
			 new Answer("Q2_A5","Great",2)]),
      new Question("q3","Q3. What is your favorite story?","hard",true,
		      [  new Answer("Q3_A1","Moby Dick","MB"), new Answer("Q3_A2","Great Expectations"),
		         new Answer("Q3_OTHER","__Other (Enter title)" ), new Answer("Q3_A4","==Other")]),
      new Question("q4","Q4. How was the last Redskins' game?","",false,
		      [  new Answer("Q4_A1","Aweful",-2), new Answer("Q4_A2","Bad",-1),
			 new Answer("Q4_A3","ok",0),new Answer("Q4_A4","Good",1),
			 new Answer("Q4_A5","Great",2)])
    ],
    "<div><bold>Thank you</bold> for taking the time for fill out the survey.  Have a great day....");
