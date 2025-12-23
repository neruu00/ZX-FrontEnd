import { MongoClient, ServerApiVersion } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  timeoutMS: 30000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  /**
   * NOTE
   * 개발 모드에서는 global 전역 변수에 연결을 저장해두고 재사용
   * 이렇게 안 하면 코드를 고칠 때마다 DB 연결이 수백 개로 늘어날 수 있음
   */
  const globalWithMongo = global as typeof globalThis & {
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
   * 배포(Production) 환경에서는 매번 새로운 연결.
   */
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// mongoDB 컬렉션 가져오기
//TODO - 공통 모듈로 분리하기
//TODO - 에러 핸들링
async function getCollection(collectionName: string) {
  const client = await clientPromise;
  const db = client.db('zx_test');
  return db.collection(collectionName);
}

export { clientPromise, getCollection };
