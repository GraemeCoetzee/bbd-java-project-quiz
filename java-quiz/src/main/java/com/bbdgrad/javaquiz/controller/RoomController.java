package com.bbdgrad.javaquiz.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.*;
import com.bbdgrad.javaquiz.model.Session;
import com.bbdgrad.javaquiz.model.Answer;
import com.bbdgrad.javaquiz.model.Question;
import com.bbdgrad.javaquiz.model.Quiz;
import com.bbdgrad.javaquiz.model.Results;
import com.bbdgrad.javaquiz.model.Room;
import com.bbdgrad.javaquiz.model.Score;

@Controller
public class RoomController {
  public static List<Session> sessions;
  
  public RoomController() {
    if(sessions == null)
      sessions = new ArrayList<Session>();
  }

  @MessageMapping("/quiz/{room}")
  @SendTo("/topic/quiz/{room}")
  public List<Session> addSession(Session session) {
    if(session.getJoin()) {
      if(!testValidRoom(session) && !session.getHost()) {
        Session s = new Session(session);
        List<Session> errorSession = new ArrayList<Session>();
        s.setJoin(false);
        errorSession.add(s);
        return errorSession;
      }

      Boolean add = false;
      for(int i = 0; i < sessions.size(); i++) {
        if(sessions.get(i).getHost() && sessions.get(i).getMode().equals(session.getMode()) && sessions.get(i).getRoomID().equals(session.getRoomID())) {
          add = true;
        }
      }

      if(session.getHost() || add)
        sessions.add(session);
    }
    
    List<Session> roomSessions = new ArrayList<Session>();
    for(int i = 0; i < sessions.size(); i++) {
      if(sessions.get(i).getRoomID().equals(session.getRoomID())) {
        roomSessions.add(sessions.get(i));
      }
    }

    return roomSessions;
  }

  Boolean testValidRoom(Session session) {
    Boolean valid = false;
    for(int i = 0; i < sessions.size(); i++) {
      if(sessions.get(i).getHost() && sessions.get(i).getRoomID().equals(session.getRoomID())) {
        valid = true;
        break;
      }
    }

    return valid;
  }

  @MessageMapping("/quiz/quizbegin/{room}")
  @SendTo("/topic/quiz/quizbegin/{room}")
  public Quiz returnQuiz(Room r) {
    Quiz newQuiz = new Quiz();
    return newQuiz;
  }

  @MessageMapping("/quiz/questions/{room}")
  @SendTo("/topic/quiz/questions/{room}")
  public Question sendQuestion(Question ques) {
    return ques;
  }

  @MessageMapping("/quiz/answers/{room}")
  @SendTo("/topic/quiz/answers/{room}")
  public Answer sendAnswer(Answer ans) {
    return ans;
  }

  @MessageMapping("/quiz/updatescore/{room}")
  public void updateScore(Score score) {
    sessions.forEach( session -> {
      if(session.getSessionID().equals(score.getUser())){
        session.setScore(session.getScore() + score.getPointsGained());
      }
    });
  }

  @MessageMapping("/quiz/score/{room}")
  @SendTo("/topic/quiz/score/{room}")
  public List<Session> updateScore(Session session) {
    return sessions;
  }

  @MessageMapping("/quiz/questionroundsessions/{room}")
  @SendTo("/topic/quiz/questionroundsessions/{room}")
  public List<Session> getScores(Room room) {
    List<Session> scores = new ArrayList<Session>();
    for(int i = 0; i < sessions.size(); i++) {
      if(!sessions.get(i).getHost() && sessions.get(i).getRoomID().equals(room.getRoomID())) {
        scores.add(sessions.get(i));
      }
    }
    return scores;
  }

  @MessageMapping("/quiz/sendscoreresult/{room}")
  @SendTo("/topic/quiz/sendscoreresult/{room}")
  public Results getScores(Results result) {
    return result;
  }

  @MessageMapping("/quiz/done/{room}")
  @SendTo("/topic/quiz/done/{room}")
  public int done() {
    return 0;
  }
}