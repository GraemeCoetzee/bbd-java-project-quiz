package com.bbdgrad.javaquiz.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.*;
import com.bbdgrad.javaquiz.model.Session;

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
    Boolean add = false;
    for(int i = 0; i < sessions.size(); i++) {
      if(sessions.get(i).getHost() && sessions.get(i).getMode().equals(session.getMode()) && sessions.get(i).getRoomID().equals(session.getRoomID())) {
        add = true;
      }
    }

    if(session.getHost() || add)
      sessions.add(session);

    List<Session> roomSessions = new ArrayList<Session>();
    for(int i = 0; i < sessions.size(); i++) {
      if(sessions.get(i).getRoomID().equals(session.getRoomID())) {
        roomSessions.add(sessions.get(i));
      }
    }
    
    return roomSessions;
  }
}