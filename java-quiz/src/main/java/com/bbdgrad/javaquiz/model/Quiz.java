package com.bbdgrad.javaquiz.model;

class Quiz {
    private int numberOfQuestions;
    private String questions[];
    private String correctAnswers[];
    private String wrongAnswers[][];
    private Number roomID;

    Quiz() {
        this.numberOfQuestions = 0;
        this.questions = new String[0];
        this.correctAnswers = new String[0];
        this.wrongAnswers = new String[0][0];
        this.roomID = 0;
    }

    Quiz(Quiz quiz) {
        this.numberOfQuestions = quiz.numberOfQuestions;
        this.questions = quiz.questions;
        this.correctAnswers = quiz.correctAnswers;
        this.wrongAnswers = quiz.wrongAnswers;
        this.roomID = quiz.roomID;
    }

    String getQuestion(int index) {
        return this.questions[index];
    }

    String getCorrectAnswer(int index) {
        return this.correctAnswers[index];
    }

    String[] getWrongAnswer(int index) {
        return this.wrongAnswers[index];
    }

    String[] getQuestions() {
        return this.questions;
    }

    String[] getCorrectAnswers() {
        return this.correctAnswers;
    }

    String[][] getWrongAnswers() {
        return this.wrongAnswers;
    }
}