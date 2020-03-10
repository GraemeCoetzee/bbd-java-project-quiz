package com.bbdgrad.javaquiz.model;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Quiz {
    private int numberOfQuestions;
    private String questions[];
    private String correctAnswers[][];
    private String wrongAnswers[][];
    private Number roomID;

    public Quiz() {
        this.numberOfQuestions = 0;
        this.questions = new String[0];
        this.correctAnswers = new String[0][0];
        this.wrongAnswers = new String[0][0];
        this.roomID = 0;
    }

    public Quiz(Quiz quiz) {
        this.numberOfQuestions = quiz.numberOfQuestions;
        this.questions = quiz.questions;
        this.correctAnswers = quiz.correctAnswers;
        this.wrongAnswers = quiz.wrongAnswers;
        this.roomID = quiz.roomID;
    }

    public int getNumberOfQuestions() {
        return numberOfQuestions;
    }

    public String getQuestion(int index) {
        return this.questions[index];
    }

    public String getCorrectAnswer(int index) {
        return this.correctAnswers[index][0];
    }

    public String[] getWrongAnswer(int index) {
        return this.wrongAnswers[index];
    }

    public String[] getQuestions() {
        return this.questions;
    }

    public String[][] getCorrectAnswers() {
        return this.correctAnswers;
    }

    public String[][] getWrongAnswers() {
        return this.wrongAnswers;
    }

    public void setRoomID(Number roomID) {
        this.roomID = roomID;
    }

    public Number getRoomID() {
        return roomID;
    }

    public void setQuestions(String[] questions) {
        this.questions = questions;
    }

    public void setAnswers(String[][] answers) {
        this.correctAnswers = answers;
    }

    public void setWrongAnswers(String[][] wrong) {
        this.wrongAnswers = wrong;
    }

    public void setNumberOfQuestions(int noOfQ) {
        this.numberOfQuestions = noOfQ;
    }
}