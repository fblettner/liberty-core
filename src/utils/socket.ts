/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
import { io, Socket } from 'socket.io-client';
import { GlobalSettings } from './GlobalSettings';

const socketUrl = GlobalSettings.getBackendURL;

export interface SocketAuthData {
  user: string;
  application: string;
}

// Stateful socket connection manager
export default class SocketClient {
  socket: Socket | null = null;
  
  connect(eventName: string, data: SocketAuthData) {
    if (!this.socket) {
      this.socket = io(socketUrl, {
        transports: ['websocket'], // Better performance than 'polling'
        auth: { user: data.user, app: data.application },
        reconnection: true,        // Enable automatic reconnection
        reconnectionAttempts: 5,   // Optional: limit reconnection attempts
        reconnectionDelay: 2000,   // Optional: delay between attempts
      });

      // Setup common event listeners here, like connection success or errors
      this.socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      // Clean up event listeners
      this.socket.off();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(eventName: string, data: SocketAuthData) {
    return new Promise((resolve, reject) => {
      if (this.socket) {
        this.socket.emit(eventName, data, (response: unknown) => {
          resolve(response);
        });
      } else {
        reject(new Error("Socket not connected"));
      }
    });
  }

  on(eventName: string, func: () => void) {
    if (this.socket) {
      this.socket.on(eventName, func);
    }
  }

  // Add a method to remove specific event listeners if needed
  off(eventName: string) {
    if (this.socket) {
      this.socket.off(eventName);
    }
  }
}

export const socketHandler = (socket: SocketClient) => {
  return {
    connect: (payload: any) => {
      socket.connect('connect', payload);
    },

    reserve: async (payload: any, onReserveStatus: (status: { record: any; user: string; status: boolean }) => void) => {
      try {
        let response = await socket.emit('reserve', payload).then((data) => data);

        if (typeof response === 'object' && response !== null && 'status' in response) {
          onReserveStatus({
            record: payload,
            user: "",
            status: response.status !== "OK",
          });
        }
      } catch (error) {
        console.error("Socket reservation error:", error);
      }
    },

    release: (payload: any) => {
      socket.emit('release', payload);
    },

    signout: () => {
      socket.disconnect();
    },
  };
};