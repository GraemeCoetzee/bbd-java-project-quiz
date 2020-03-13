package com.bbdgrad.javaquiz.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class Score {
    private String user;
    private int score;
    private int pointsGained;

    public Score (String user, int score, int points) {
        this.user = user;
        this.score = score;
        this.pointsGained = points;
    }

    public Score(Score score) {
        this.user = score.user;
        this.score = score.score;
    }

    public String getUser() {
        return this.user;
    }

    public int getScore() {
        return this.score;
    }

    public int getPointsGained() {
        return this.pointsGained;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public void setPointsGained(int points) {
        this.pointsGained = points;
    }
}