import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  /**
   * NOTE
   * 개발 모드에서는 전역 변수(global)에 연결을 저장해두고 재사용
   * 이렇게 안 하면 코드를 고칠 때마다 DB 연결이 수백 개로 늘어날 수 있음
   */
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  /**
   * NOTE
   * 배포(Production) 환경에서는 매번 새로운 연결을 만듭니다.
   */
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
