package com.bbdgrad.javaquiz.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.*;
import com.bbdgrad.javaquiz.model.Session;
import com.bbdgrad.javaquiz.model.Quiz;
import com.bbdgrad.javaquiz.model.Room;

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

    System.out.println(r.getRoomID());

    Quiz newQuiz = new Quiz();
    newQuiz.setRoomID(r.getRoomID());
    return newQuiz;
  }
}