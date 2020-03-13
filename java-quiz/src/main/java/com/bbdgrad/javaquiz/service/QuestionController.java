package com.bbdgrad.javaquiz.service;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import okhttp3.*;
import java.lang.StringBuilder;

import com.bbdgrad.javaquiz.model.QuestionRequest;

import java.io.IOException;

@Controller
public class QuestionController {

    private final OkHttpClient httpClient = new OkHttpClient();
    @MessageMapping("/questions-request")
    @SendTo("/topic/questions-response")
    public String requestQuestions(QuestionRequest questionsConfig) throws IOException{
        String url = generateURL(questionsConfig);
        Request request = new Request.Builder()
                .url(url)
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);
            return response.body().string();
        }
    }

    public String generateURL(QuestionRequest request){
        StringBuilder base = new StringBuilder("https://opentdb.com/api.php?");
        base.append("amount="+request.getNumQuestions());
        if(!request.getCategory().equals("any")){
            base.append("&category=");
            base.append(request.getCategory());
        }
        if(!request.getDifficulty().equals("any")){
            base.append("&difficulty=");
            base.append(request.getDifficulty());
        }
        if(!request.getType().equals("any")){
            base.append("&type=");
            base.append(request.getType());
        }

        return base.toString();
    }


}