package com.bbdgrad.javaquiz.model;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class Answer {
    private String answer;
    private String user;

    public Answer(String answer, String user) {
        this.answer = answer;
        this.user = user;
    }

    public Answer(Answer answer) {
        this.answer = answer.answer;
        this.user = answer.user;
    }

    public String getAnswer() {
        return this.answer;
    }

    public String getUser() {
        return this.user;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public void setUser(String user) {
        this.user = user;
    } 
}