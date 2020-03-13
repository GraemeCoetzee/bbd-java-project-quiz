package com.bbdgrad.javaquiz.model;

public class Session {
    private Number roomID;
    private String mode;
    private Boolean host;
    private Boolean join;
    private String sessionID;
    private int score;
    private String user;
  
    public Session() {
    }
  
    public Session(Number roomID, String mode, Boolean host, Boolean join, String user) {
      this.roomID = roomID;
      this.mode = mode;
      this.host = host;
      this.join = join;
      this.user =  user;
    }

    public Session(Session session) {
        this.roomID = session.roomID;
        this.mode = session.mode;
        this.host = session.host;
        this.join = session.join;
        this.sessionID = session.sessionID;
        this.score = session.score;
        this.user = session.user;
    }
  
    public Number getRoomID() {
      return roomID;
    }

    public String getMode() {
        return this.mode;
    }

    public Boolean getHost() {
        return this.host;
    }

    public Boolean getJoin() {
        return this.join;
    }

    public String getSessionID() {
        return this.sessionID;
    }

    public int getScore() {
        return this.score;
    }

    public String getUser() {
        return this.user;
    }

    public void setRoom(Number room) {
        this.roomID = room;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public void setHost(Boolean host) {
        this.host = host;
    }

    public void setJoin(Boolean join) {
        this.join = join;
    }

    public void setSessionID(String id) {
        this.sessionID = id;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public void setUser(String user) {
        this.user = user;
    }
}