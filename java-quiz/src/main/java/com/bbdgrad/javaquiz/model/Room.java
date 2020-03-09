package com.bbdgrad.javaquiz.model;

public class Room {
    private Number roomID;

    public Room() {}

    public Room(Number roomID) {
        this.roomID = roomID;
    }

    public Room(Room room) {
        this.roomID = room.roomID;
    }

    public Number getRoomID() {
        return roomID;
      }

    public void setRoom(Number room) {
        this.roomID = room;
    }
}