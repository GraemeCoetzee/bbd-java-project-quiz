package com.bbdgrad.javaquiz.model;
import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class Results {
    private List<Session> sessions;
    private List<AnswerResult> answers;

    public Results(List<Session> sessions, List<AnswerResult> answers) {
        this.sessions = sessions;
        this.answers = answers;
    }

    public List<Session> getSessions() {
        return this.sessions;
    }

    public List<AnswerResult> getAnswers() {
        return this.answers;
    }

    public void setSessions(List<Session> sessions) {
        this.sessions = sessions;
    }

    public void setAnswers(List<AnswerResult> answers) {
        this.answers = answers;
    }
}