// import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import type { IRealTimeEvent, ISocketUser, ITypingIndicator } from "common-types";

type Socket = any;
type SocketIOServer = any;

class SocketService {
  private io: SocketIOServer | null = null;
  private connectedUsers: Map<string, Set<string>> = new Map(); // userId -> Set of socketIds
  private socketToUser: Map<string, string> = new Map(); // socketId -> userId

  /**
   * Initialize Socket.IO server
   */
  public initialize(httpServer: HTTPServer) {
    // TODO: Install socket.io package
    // this.io = new SocketIOServer(httpServer, {
    //   cors: {
    //     origin: "*",
    //     methods: ["GET", "POST"],
    //   },
    //   path: "/socket.io",
    // });

    // this.setupEventHandlers();
    console.log("⚠️  Socket.IO not installed - real-time features disabled");
  }

  /**
   * Setup event handlers
   */
  private setupEventHandlers() {
    if (!this.io) return;

    this.io.on("connection", (socket: Socket) => {
      console.log(`🔌 Socket connected: ${socket.id}`);

      // Authentication
      socket.on("authenticate", (data: { userId: string; token?: string }) => {
        this.handleAuthentication(socket, data);
      });

      // Join rooms (for needs, teams, etc.)
      socket.on("join_room", (roomId: string) => {
        socket.join(roomId);
        console.log(`📥 Socket ${socket.id} joined room: ${roomId}`);
      });

      // Leave rooms
      socket.on("leave_room", (roomId: string) => {
        socket.leave(roomId);
        console.log(`📤 Socket ${socket.id} left room: ${roomId}`);
      });

      // Typing indicators
      socket.on("typing_start", (data: { roomId: string; userName: string }) => {
        this.handleTypingStart(socket, data);
      });

      socket.on("typing_stop", (data: { roomId: string }) => {
        this.handleTypingStop(socket, data);
      });

      // Disconnection
      socket.on("disconnect", () => {
        this.handleDisconnect(socket);
      });
    });
  }

  /**
   * Handle user authentication
   */
  private handleAuthentication(socket: Socket, data: { userId: string; token?: string }) {
    const { userId } = data;

    // TODO: Verify token if provided

    // Map socket to user
    this.socketToUser.set(socket.id, userId);

    // Add socket to user's connections
    if (!this.connectedUsers.has(userId)) {
      this.connectedUsers.set(userId, new Set());
    }
    this.connectedUsers.get(userId)!.add(socket.id);

    // Join user's personal room
    socket.join(`user:${userId}`);

    // Emit online event
    this.emitToAll("user:online", { userId });

    socket.emit("authenticated", { userId, socketId: socket.id });
    console.log(`✅ Socket ${socket.id} authenticated as user ${userId}`);
  }

  /**
   * Handle typing start
   */
  private handleTypingStart(socket: Socket, data: { roomId: string; userName: string }) {
    const userId = this.socketToUser.get(socket.id);
    if (!userId) return;

    const typingData: ITypingIndicator = {
      userId,
      userName: data.userName,
      roomId: data.roomId,
      timestamp: new Date(),
    };

    // Broadcast to room (except sender)
    socket.to(data.roomId).emit("typing_indicator", {
      type: "start",
      ...typingData,
    });
  }

  /**
   * Handle typing stop
   */
  private handleTypingStop(socket: Socket, data: { roomId: string }) {
    const userId = this.socketToUser.get(socket.id);
    if (!userId) return;

    socket.to(data.roomId).emit("typing_indicator", {
      type: "stop",
      userId,
      roomId: data.roomId,
    });
  }

  /**
   * Handle disconnect
   */
  private handleDisconnect(socket: Socket) {
    const userId = this.socketToUser.get(socket.id);

    if (userId) {
      // Remove socket from user's connections
      const userSockets = this.connectedUsers.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);

        // If no more sockets for user, emit offline event
        if (userSockets.size === 0) {
          this.connectedUsers.delete(userId);
          this.emitToAll("user:offline", { userId });
        }
      }

      this.socketToUser.delete(socket.id);
    }

    console.log(`🔌 Socket disconnected: ${socket.id}`);
  }

  /**
   * Emit event to a specific user (all their connections)
   */
  public async emitToUser(userId: string, event: string, data: any): Promise<void> {
    if (!this.io) return;

    this.io.to(`user:${userId}`).emit(event, data);
  }

  /**
   * Emit event to a room
   */
  public async emitToRoom(roomId: string, event: string, data: any): Promise<void> {
    if (!this.io) return;

    this.io.to(roomId).emit(event, data);
  }

  /**
   * Emit event to all connected clients
   */
  public async emitToAll(event: string, data: any): Promise<void> {
    if (!this.io) return;

    this.io.emit(event, data);
  }

  /**
   * Emit event to multiple users
   */
  public async emitToUsers(userIds: string[], event: string, data: any): Promise<void> {
    if (!this.io) return;

    userIds.forEach((userId) => {
      this.io!.to(`user:${userId}`).emit(event, data);
    });
  }

  /**
   * Check if user is online
   */
  public isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  /**
   * Get online users count
   */
  public getOnlineUsersCount(): number {
    return this.connectedUsers.size;
  }

  /**
   * Get user's socket count
   */
  public getUserSocketCount(userId: string): number {
    return this.connectedUsers.get(userId)?.size || 0;
  }

  /**
   * Get all online user IDs
   */
  public getOnlineUserIds(): string[] {
    return Array.from(this.connectedUsers.keys());
  }

  /**
   * Emit real-time event with proper structure
   */
  public async emitRealTimeEvent(event: IRealTimeEvent): Promise<void> {
    if (!event.userId) {
      // Emit to all if no specific user
      await this.emitToAll(event.type, event.payload);
    } else {
      await this.emitToUser(event.userId, event.type, event.payload);
    }

    // If roomId is specified, also emit to room
    if (event.roomId) {
      await this.emitToRoom(event.roomId, event.type, event.payload);
    }
  }

  /**
   * Get Socket.IO server instance
   */
  public getIO(): SocketIOServer | null {
    return this.io;
  }
}

export const socketService = new SocketService();
