package com.bbdgrad.javaquiz.websocket;

import java.util.ArrayList;
import java.util.List;

import com.bbdgrad.javaquiz.controller.RoomController;
import com.bbdgrad.javaquiz.model.Session;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.SubscribableChannel;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.messaging.SubProtocolWebSocketHandler;
import org.springframework.web.socket.CloseStatus;

public class CustomSubProtocolWebSocketHandler extends SubProtocolWebSocketHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(CustomSubProtocolWebSocketHandler.class);

    @Autowired
    private SessionHandler sessionHandler;
    public static List<Session> sessions;

    public CustomSubProtocolWebSocketHandler(MessageChannel clientInboundChannel, SubscribableChannel clientOutboundChannel) {
        super(clientInboundChannel, clientOutboundChannel);
        if(sessions == null)
            sessions = new ArrayList<Session>();
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        LOGGER.info("New websocket connection was established" + session.getId());
        sessionHandler.register(session);
        super.afterConnectionEstablished(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception{
        LOGGER.info("Socket Disconnected");
        super.afterConnectionClosed(session, closeStatus);
        List<Session> tobeAdded = new ArrayList<Session>();

        for(int i = 0; i < RoomController.sessions.size(); i++ ) {
            if(RoomController.sessions.get(i).getSessionID().equals(session.getId())) {
                if(RoomController.sessions.get(i).getHost()) {
                    for(int j = 0; j < RoomController.sessions.size(); j++ ) {
                        if(!RoomController.sessions.get(j).getRoomID().equals(RoomController.sessions.get(i).getRoomID())) {
                            if(!tobeAdded.contains(RoomController.sessions.get(j)))
                                tobeAdded.add(RoomController.sessions.get(j));
                        }
                    }
                    break;
                } 
            }
            else {
                tobeAdded.add(RoomController.sessions.get(i));
            }
        }

        RoomController.sessions = new ArrayList<Session>();
        RoomController.sessions = tobeAdded;
    }
}