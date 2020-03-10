package com.bbdgrad.javaquiz.model;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class Question {
    private String question;
    private String possibleAnswers[];
    private int questionNumber;

    public Question(String question, String possibleAnswers[], String questionType, int questionNumber) {
        this.question = question;
        this.possibleAnswers = possibleAnswers;
        this.questionNumber = questionNumber;
    }

    public Question(Question question) {
        this.question = question.question;
        this.possibleAnswers = question.possibleAnswers;
        this.questionNumber = question.questionNumber;
    }

    public String getQuestion() {
        return this.question;
    }

    public String[] getPosssibleAnswers() {
        return this.possibleAnswers;
    }

    public int getQuestionNumber() {
        return this.questionNumber;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public void setPossibleAnswers(String[] possible) {
        this.possibleAnswers = possible;
    }

    public void setQuestionNumber(int questionNumber) {
        this.questionNumber = questionNumber;
    }
     
}