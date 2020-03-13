package com.bbdgrad.javaquiz.model;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class AnswerResult {
    private String user;
    private int points;
    private Boolean correct;

    public AnswerResult(String user, int points, Boolean correct) {
        this.user = user;
        this.points = points;
        this.correct = correct;
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

    public void setUser(String user) {
        this.user = user;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public void setCorrect(Boolean correct) {
        this.correct = correct;
    }
}