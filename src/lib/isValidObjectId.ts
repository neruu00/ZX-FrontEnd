import { ObjectId } from 'mongodb';

export default function isValidObjectId(id: string) {
  return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
}
