package com.bbdgrad.javaquiz.model;

public class QuestionRequest {

    private String numQuestions;
    private String category;
    private String difficulty;
    private String type;

    public QuestionRequest() {
    }

    public QuestionRequest(String numQuestions, String category, String difficulty, String type){
        this.numQuestions = numQuestions;
        this.category = category;
        this.difficulty = difficulty;
        this.type = type;
    }

    public String getNumQuestions() {
        return numQuestions;
    }

    public void setNumQuestions(String numQuestions) {
        this.numQuestions = numQuestions;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
