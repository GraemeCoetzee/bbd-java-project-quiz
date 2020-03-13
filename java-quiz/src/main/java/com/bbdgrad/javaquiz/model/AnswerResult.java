package com.bbdgrad.javaquiz.model;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class AnswerResult {
    private String user;
    private int points;
    private Boolean correct;
    private String correctAnswer;

    public AnswerResult(String user, int points, Boolean correct, String correctAnswer) {
        this.user = user;
        this.points = points;
        this.correct = correct;
        this.correctAnswer = correctAnswer;
    }

    public String getUser() {
        return this.user;
    }

    public int getPoints() {
        return this.points;
    }

    public Boolean getCorrect() {
        return this.correct;
    }

    public String getCorrectAnswer() {
        return this.correctAnswer;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public void setCorrect(Boolean correct) {
        this.correct = correct;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }
}