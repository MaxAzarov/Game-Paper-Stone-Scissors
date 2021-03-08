import Room, { IRoom } from "../models/Room";

interface IUserGame {
  user: string;
  nickname: string;
  choice: number;
}

interface IRooms {
  getAllRooms(): Promise<IRoom[]>;
  getRoomById(id: string): Promise<IRoom | null>;
  getRoomByName(name: string): Promise<IRoom | null>;
  createNewRoomAndAddUsers(newRoom, id, nickname): Promise<IRoom>;
  RoomAddUser(room, id, nickname): Promise<void>;
  deleteRoomById(id: string): Promise<void>;
  checkRoomUsers(room: IRoom): Promise<number>;
  userLeaveRoom(room, id): Promise<void>;
  getUserChoice(room, id): Promise<IUserGame | undefined>;
  deleteUsersGame(room): Promise<void>;
  addUserChoice(room, id, nickname, result): Promise<void>;
}

class Rooms implements IRooms {
  async getAllRooms(): Promise<IRoom[]> {
    const rooms = await Room.find({});
    return rooms;
  }

  async getRoomById(id: string): Promise<IRoom | null> {
    const room = await Room.findOne({ _id: id });
    return room;
  }

  async getRoomByName(name: string): Promise<IRoom | null> {
    const room = await Room.findOne({ name });
    return room;
  }

  async createNewRoomAndAddUsers(
    newRoom,
    id: string,
    nickname: string
  ): Promise<IRoom> {
    const room = new Room(newRoom);
    room.users.push({
      user: id,
      nickname,
    });

    await room.save();
    return room;
  }

  async RoomAddUser(room: IRoom, id: string, nickname: string): Promise<void> {
    room.users.push({
      user: id,
      nickname,
    });
    await room.save();
  }

  async deleteRoomById(id: string): Promise<void> {
    await Room.deleteOne({ _id: id });
  }

  async checkRoomUsers(room: IRoom): Promise<number> {
    return room.users.length;
  }

  async userLeaveRoom(room: IRoom, id: string): Promise<void> {
    room.users = [...room.users.filter((item) => item.user != id)];
    room.usersGame = [];
    await room.save();
  }

  async getUserChoice(room: IRoom, id: string): Promise<IUserGame | undefined> {
    const user = room.usersGame.find((item) => item.user != id);
    return user;
  }

  async deleteUsersGame(room: IRoom): Promise<void> {
    room.usersGame = [];
    await room.save();
  }

  async addUserChoice(
    room: IRoom,
    id: string,
    nickname: string,
    result: number
  ): Promise<void> {
    room.usersGame.push({
      user: id,
      nickname,
      choice: result,
    });
    await room.save();
  }
}

export default new Rooms();
