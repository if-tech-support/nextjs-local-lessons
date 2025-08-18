import Image from "next/image";
import Link from "next/link";
import { User } from "@/types/user";

// ユーザデータを取得する関数
async function getUsers(): Promise<User[]> {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">ユーザ一覧</h1>

      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <li
            key={user.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={`https://robohash.org/${user.id}`}
                  alt={`${user.username}のアバター`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500">ID: {user.id}</p>
                <h3 className="font-semibold text-lg text-gray-800">
                  {user.username}
                </h3>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                <span className="font-medium">会社:</span> {user.company.name}
              </p>
            </div>

            <Link
              href={`/users/${user.id}`}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              詳細を見る
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
